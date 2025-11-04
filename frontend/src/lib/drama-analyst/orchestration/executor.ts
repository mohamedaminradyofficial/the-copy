import { AIRequest, AIResponse, Result } from "../core/types";
import { multiAgentDebate } from "./multiAgentDebate";
import { constitutionalAI } from "./constitutionalAI";
import { uncertaintyService } from "../services/uncertaintyService";
import { selfCritiqueModule } from "../agents/shared/selfCritiqueModule";
import { RAGService } from "../services/ragService";
import { HallucinationService } from "../services/hallucinationService";
import { geminiService } from "../services/geminiService";
import { executeAgentTask, isAgentUpgraded } from "../agents/upgradedAgents";
import { TaskType } from "@core/enums";

// Initialize services
const ragService = new RAGService();
const hallucinationService = new HallucinationService();

/**
 * Enhanced task submission with advanced AI systems
 * Upgraded 2025 - Includes RAG, Constitutional AI, Multi-Agent Debate, Self-Critique, Uncertainty, and Hallucination Detection
 */
export const submitTask = async (
  request: AIRequest,
  options?: {
    enableRAG?: boolean;
    enableDebate?: boolean;
    enableConstitutional?: boolean;
    enableUncertainty?: boolean;
    enableSelfCritique?: boolean;
    enableHallucination?: boolean;
    originalText?: string;
    analysisReport?: any;
  }
): Promise<Result<AIResponse>> => {
  try {
    const { agent, prompt } = request;

    console.log(`[Executor] Starting enhanced task: ${agent}`);
    const startTime = Date.now();

    // Check if this agent has been upgraded to the new pattern
    const taskType = agent as TaskType;
    if (isAgentUpgraded(taskType)) {
      console.log(`[Executor] Using upgraded agent for ${taskType}`);

      const agentResult = await executeAgentTask(taskType, {
        input: prompt,
        options: {
          enableRAG: options?.enableRAG,
          enableSelfCritique: options?.enableSelfCritique,
          enableConstitutional: options?.enableConstitutional,
          enableUncertainty: options?.enableUncertainty,
          enableHallucination: options?.enableHallucination,
          enableDebate: options?.enableDebate,
        },
        context: {
          originalText: options?.originalText,
          analysisReport: options?.analysisReport,
        },
      });

      const processingTime = Date.now() - startTime;

      return {
        ok: true,
        value: {
          text: agentResult.text,
          raw: agentResult.text,
          parsed: {
            result: agentResult.text,
            confidence: agentResult.confidence || 0.85,
            processingTime,
            enhancementsApplied: {
              rag: options?.enableRAG || false,
              selfCritique: options?.enableSelfCritique !== false,
              hallucination: options?.enableHallucination || false,
              constitutional: options?.enableConstitutional !== false,
              uncertainty: options?.enableUncertainty || false,
              debate: options?.enableDebate || false,
            },
            notes: agentResult.notes,
          },
          meta: {
            confidence: agentResult.confidence || 0.85,
            processingTime,
            timestamp: new Date().toISOString(),
            ragEnabled: options?.enableRAG || false,
            hallucinationCheckEnabled: options?.enableHallucination || false,
          },
        },
      };
    }

    // Fallback to original implementation for non-upgraded agents
    console.log(`[Executor] Using legacy implementation for ${agent}`);

    // Step 0: RAG - Retrieve relevant context (if enabled and sources available)
    let enrichedPrompt = prompt;
    let ragContext = null;
    if (options?.enableRAG && options?.originalText) {
      console.log("[Executor] Step 0: Retrieving relevant context (RAG)...");
      try {
        ragContext = await ragService.retrieveContext(
          prompt,
          options.originalText,
          options.analysisReport || {},
          5
        );

        // Enrich prompt with retrieved context
        const contextSummary = ragContext.retrievedChunks
          .map(
            (chunk, i) =>
              `[السياق ${i + 1}]: ${chunk.content.substring(0, 300)}...`
          )
          .join("\n\n");

        enrichedPrompt = `${prompt}\n\n---\nالسياق المسترجع من النص الأصلي والتحليل:\n${contextSummary}\n---\n`;
        console.log("[Executor] RAG context added to prompt");
      } catch (error) {
        console.warn(
          "[Executor] RAG retrieval failed, continuing with original prompt...",
          error
        );
      }
    }

    // Step 1: Basic task execution
    console.log("[Executor] Step 1: Basic execution...");
    let output = await geminiService.generateContent(enrichedPrompt);

    // Step 2: Self-Critique (if enabled)
    if (options?.enableSelfCritique !== false) {
      console.log("[Executor] Step 2: Applying self-critique...");
      try {
        const critique = await selfCritiqueModule.applySelfCritique(
          output,
          `Task: ${agent}`,
          { prompt, agent },
          2
        );
        output = critique.refinedOutput;
      } catch (error) {
        console.warn("[Executor] Self-critique failed, continuing...", error);
      }
    }

    // Step 2.5: Hallucination Detection (if enabled and sources available)
    let hallucinationCheck = null;
    if (options?.enableHallucination && options?.originalText) {
      console.log("[Executor] Step 2.5: Detecting hallucinations...");
      try {
        hallucinationCheck = await hallucinationService.detectHallucinations(
          output,
          options.originalText,
          options.analysisReport || {}
        );

        if (hallucinationCheck.isHallucinated) {
          console.warn(
            `[Executor] Found ${hallucinationCheck.hallucinatedParts.length} hallucinated claims, applying corrections...`
          );
          output = hallucinationCheck.correctedOutput;
        } else {
          console.log("[Executor] No hallucinations detected");
        }
      } catch (error) {
        console.warn(
          "[Executor] Hallucination detection failed, continuing...",
          error
        );
      }
    }

    // Step 3: Constitutional AI Validation (if enabled)
    if (options?.enableConstitutional !== false) {
      console.log("[Executor] Step 3: Constitutional validation...");
      try {
        const constitutional = await constitutionalAI.applyConstitutionalRules(
          output,
          { originalText: prompt, analysisReport: {} }
        );

        if (!constitutional.isValid) {
          console.warn(
            "[Executor] Constitutional violations found, applying fixes..."
          );
        }
        output = constitutional.revisedOutput;
      } catch (error) {
        console.warn(
          "[Executor] Constitutional validation failed, continuing...",
          error
        );
      }
    }

    // Step 4: Uncertainty Assessment (if enabled)
    let uncertaintyMetrics;
    if (options?.enableUncertainty) {
      console.log("[Executor] Step 4: Measuring uncertainty...");
      try {
        uncertaintyMetrics = await uncertaintyService.assessConfidence(output, {
          prompt,
          agent,
        });
      } catch (error) {
        console.warn(
          "[Executor] Uncertainty assessment failed, continuing...",
          error
        );
      }
    }

    const processingTime = Date.now() - startTime;
    console.log(
      `[Executor] Complete in ${(processingTime / 1000).toFixed(2)}s`
    );

    // Ensure text-only output (no JSON)
    const cleanOutput = typeof output === "string" ? output : String(output);
    const textOnlyOutput = cleanOutput
      .replace(/```json[\s\S]*?```/g, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\{[\s\S]*?\}/g, (match) => {
        // Keep curly braces only if they're part of natural text
        if (match.includes('"') && match.includes(":")) return "";
        return match;
      })
      .trim();

    return {
      ok: true,
      value: {
        text: textOnlyOutput,
        raw: textOnlyOutput,
        parsed: {
          result: textOnlyOutput,
          confidence: uncertaintyMetrics || 0.85,
          processingTime,
          enhancementsApplied: {
            rag: options?.enableRAG && !!ragContext,
            selfCritique: options?.enableSelfCritique !== false,
            hallucination: options?.enableHallucination && !!hallucinationCheck,
            constitutional: options?.enableConstitutional !== false,
            uncertainty: options?.enableUncertainty || false,
            debate: options?.enableDebate || false,
          },
          ragContext: ragContext
            ? {
                chunksRetrieved: ragContext.retrievedChunks.length,
                avgRelevance:
                  ragContext.relevanceScores.reduce((a, b) => a + b, 0) /
                  ragContext.relevanceScores.length,
              }
            : null,
          hallucinationCheck: hallucinationCheck
            ? {
                detected: hallucinationCheck.isHallucinated,
                claimsChecked: hallucinationCheck.factCheckResults.length,
                unsupportedClaims: hallucinationCheck.hallucinatedParts.length,
              }
            : null,
        },
        meta: {
          confidence: uncertaintyMetrics || 0.85,
          processingTime,
          timestamp: new Date().toISOString(),
          ragEnabled: options?.enableRAG && !!ragContext,
          hallucinationCheckEnabled:
            options?.enableHallucination && !!hallucinationCheck,
        },
      },
    };
  } catch (error: any) {
    console.error("[Executor] Error:", error);
    return {
      ok: false,
      error: {
        code: "EXECUTOR_ERROR",
        message: error.message || "Unknown error occurred",
        cause: error,
      },
    };
  }
};
