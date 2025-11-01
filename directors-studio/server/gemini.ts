// Integration: blueprint:javascript_gemini
// Using Gemini AI for film production analysis and assistance

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ScriptAnalysis {
  scenes: Array<{
    sceneNumber: number;
    title: string;
    location: string;
    timeOfDay: string;
    characters: string[];
    description: string;
  }>;
  characters: Array<{
    name: string;
    description: string;
  }>;
  summary: string;
}

export async function analyzeScript(scriptText: string): Promise<ScriptAnalysis> {
  try {
    const systemPrompt = `أنت خبير في تحليل السيناريوهات السينمائية. قم بتحليل السيناريو المقدم واستخرج:
1. المشاهد (scenes) - لكل مشهد: رقم المشهد، عنوان مناسب، الموقع، وقت اليوم (نهار/ليل)، الشخصيات الموجودة، وصف مختصر
2. الشخصيات (characters) - لكل شخصية: الاسم ووصف مختصر
3. ملخص عام للقصة (summary)

قم بالرد بتنسيق JSON التالي:
{
  "scenes": [{"sceneNumber": 1, "title": "...", "location": "...", "timeOfDay": "...", "characters": ["..."], "description": "..."}],
  "characters": [{"name": "...", "description": "..."}],
  "summary": "..."
}`;

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: [{
        role: "user",
        parts: [{ text: scriptText }]
      }],
    });

    const rawJson = response.text;
    if (rawJson) {
      try {
        const data: ScriptAnalysis = JSON.parse(rawJson);
        return data;
      } catch (parseError) {
        console.error("Failed to parse JSON:", rawJson);
        throw new Error("فشل في تحليل البيانات المستلمة");
      }
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Failed to analyze script:", error);
    throw new Error(`فشل تحليل السيناريو: ${error}`);
  }
}

export interface ShotSuggestion {
  suggestion: string;
  reasoning: string;
}

export async function getShotSuggestions(
  sceneDescription: string,
  shotType: string,
  cameraAngle: string
): Promise<ShotSuggestion> {
  try {
    const prompt = `أنت مدير تصوير محترف. بناءً على وصف المشهد التالي:
"${sceneDescription}"

نوع اللقطة المختار: ${shotType}
زاوية الكاميرا: ${cameraAngle}

قدم اقتراحاً احترافياً لتحسين هذه اللقطة، مع شرح السبب. استخدم JSON:
{
  "suggestion": "الاقتراح بالتفصيل",
  "reasoning": "السبب والتفسير"
}`;

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
      },
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
    });

    const rawJson = response.text;
    if (rawJson) {
      try {
        return JSON.parse(rawJson);
      } catch (parseError) {
        console.error("Failed to parse JSON:", rawJson);
        throw new Error("فشل في تحليل البيانات المستلمة");
      }
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Failed to get shot suggestions:", error);
    throw new Error(`فشل الحصول على الاقتراحات: ${error}`);
  }
}

export async function chatWithAssistant(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const systemPrompt = `أنت مساعد ذكاء اصطناعي متخصص في الإخراج السينمائي والإنتاج الفني. 
مهمتك مساعدة المخرجين في:
- تحليل السيناريوهات
- اقتراح زوايا التصوير والإضاءة
- تخطيط المشاهد واللقطات
- حل المشاكل الإنتاجية
- تقديم نصائح احترافية

قدم إجابات مفيدة ومهنية باللغة العربية.`;

    const contents = conversationHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: contents,
    });

    return response.text || "عذراً، لم أتمكن من الرد.";
  } catch (error) {
    console.error("Failed to chat with assistant:", error);
    throw new Error(`فشل التواصل مع المساعد: ${error}`);
  }
}
