import { NextRequest, NextResponse } from 'next/server';
import { getGeminiService, GeminiModel } from '@/lib/ai/gemini-service';

/**
 * POST /api/cineai/generate-shots
 * Generate shot list from script using AI
 */
export async function POST(request: NextRequest) {
  try {
    const { script } = await request.json();

    if (!script || typeof script !== 'string') {
      return NextResponse.json(
        { error: 'Script text is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('No Gemini API key found, using fallback mock data');
      return generateMockShots();
    }

    // Initialize Gemini service
    const geminiService = getGeminiService({
      apiKey,
      defaultModel: GeminiModel.FLASH,
      maxRetries: 3,
      timeout: 30000,
    });

    // Generate shot list using AI
    const systemInstruction = `أنت خبير في التصوير السينمائي وتخطيط اللقطات. قم بتحليل النص المقدم واقترح قائمة لقطات احترافية.

You are an expert in cinematography and shot planning. Analyze the provided script and suggest a professional shot list.

Return the response as a JSON array of shot objects with the following structure:
[
  {
    "id": number,
    "type": "shot type (e.g., Wide Shot, Medium Shot, Close-up)",
    "description": "brief description of what the shot shows",
    "camera": "camera movement (e.g., Static, Pan, Dolly, Handheld)",
    "lighting": "lighting setup (e.g., Natural, Three-point, Soft key)",
    "notes": "director's notes and tips"
  }
]

Provide 5-8 shots that cover the key moments in the script.`;

    const prompt = `النص السينمائي / Script:

${script}

قم بإنشاء قائمة لقطات احترافية لهذا النص، مع مراعاة التدفق السردي والانتقالات البصرية.
Generate a professional shot list for this script, considering narrative flow and visual transitions.`;

    const response = await geminiService.generateContent(prompt, {
      systemInstruction,
      temperature: 0.7,
      maxTokens: 4096,
    });

    // Parse the AI response
    let shots;
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        shots = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, fallback to mock data
        console.warn('Could not parse AI response, using fallback');
        return generateMockShots();
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return generateMockShots();
    }

    return NextResponse.json({
      success: true,
      shots,
      generatedAt: new Date().toISOString(),
      source: 'ai',
    });
  } catch (error) {
    console.error('Error generating shots:', error);
    return NextResponse.json(
      { error: 'Failed to generate shot list' },
      { status: 500 }
    );
  }
}

/**
 * Fallback function to generate mock shots when AI is unavailable
 */
function generateMockShots() {
  const mockShots = [
    {
      id: 1,
      type: 'Wide Shot',
      description: 'Establishing shot of the location',
      camera: 'Static',
      lighting: 'Natural',
      notes: 'Set the scene and show the environment'
    },
    {
      id: 2,
      type: 'Medium Shot',
      description: 'Character enters frame',
      camera: 'Dolly in',
      lighting: 'Three-point setup',
      notes: 'Follow character movement smoothly'
    },
    {
      id: 3,
      type: 'Close-up',
      description: 'Character emotional reaction',
      camera: 'Handheld',
      lighting: 'Soft key light',
      notes: 'Capture subtle facial expressions'
    },
  ];

  return NextResponse.json({
    success: true,
    shots: mockShots,
    generatedAt: new Date().toISOString(),
    source: 'mock',
  });
}
