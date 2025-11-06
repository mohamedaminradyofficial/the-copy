/**
 * Seven Stations Analysis API Route
 *
 * Provides endpoint for running the complete seven stations pipeline
 * Uses new text-only interfaces from lib/ai/interfaces/stations.ts
 *
 * Enhanced with Redis caching for improved performance
 */

import { NextRequest, NextResponse } from "next/server";
import { runSevenStations } from "@/lib/ai/stations";
import { runPipelineWithInterfaces } from "@/lib/ai/pipeline-orchestrator";
import { getCached, invalidateCache } from "@/lib/redis";
import crypto from "crypto";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

interface AnalysisRequest {
  text: string;
  metadata?: string;
  useNewInterface?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();

    if (!body.text || body.text.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "النص مطلوب للتحليل",
        },
        { status: 400 }
      );
    }

    // Check text length
    if (body.text.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "النص قصير جداً. يجب أن يكون النص على الأقل 50 حرفاً",
        },
        { status: 400 }
      );
    }

    if (body.text.length > 100000) {
      return NextResponse.json(
        {
          success: false,
          error: "النص طويل جداً. الحد الأقصى 100,000 حرف",
        },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Generate cache key from text content hash
    const textHash = crypto
      .createHash('md5')
      .update(body.text)
      .digest('hex');
    const cacheKey = `seven-stations:${textHash}`;

    // Use Redis cache with 1 hour TTL
    const result = await getCached(
      cacheKey,
      async () => {
        return await runSevenStations(body.text, body.metadata);
      },
      3600 // 1 hour
    );

    const executionTime = Date.now() - startTime;

    if (result.success) {
      return NextResponse.json({
        success: true,
        report: result.fullReport,
        stations: result.outputs.map((output) => ({
          id: output.stationId,
          name: output.stationName,
          summary: output.textOutput.substring(0, 200) + "...",
          fullText: output.textOutput,
          confidence: 0.85, // Default confidence
          status: "completed",
        })),
        confidence: 0.85,
        executionTime,
        stationsCount: result.outputs.length,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "فشل التحليل",
          stations: result.outputs.map((output) => ({
            id: output.stationId,
            name: output.stationName,
            summary: output.textOutput || "فشل في إكمال هذه المحطة",
            status: output.success ? "completed" : "error",
          })),
          executionTime,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Seven Stations API] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ غير متوقع أثناء التحليل",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Seven Stations Analysis",
    status: "active",
    version: "2.0.0",
    features: [
      "Text-only protocol (no JSON)",
      "Sequential pipeline (1→7)",
      "Structured interfaces",
      "Arabic text analysis",
    ],
  });
}
