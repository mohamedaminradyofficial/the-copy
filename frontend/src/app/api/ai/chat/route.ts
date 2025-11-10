import { NextRequest } from 'next/server';
import { streamFlash } from '@/lib/ai/gemini-core';

/**
 * POST /api/ai/chat
 * Stream AI chat responses in real-time
 */
export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Build conversation context from history
    let conversationContext = '';
    if (history && Array.isArray(history) && history.length > 0) {
      conversationContext = history
        .map((msg: { role: string; content: string }) => {
          const roleLabel = msg.role === 'user' ? 'المستخدم' : 'المساعد';
          return `${roleLabel}: ${msg.content}`;
        })
        .join('\n\n');
      conversationContext = `محادثة سابقة / Previous conversation:\n\n${conversationContext}\n\n---\n\n`;
    }

    const systemInstruction = `أنت مساعد ذكي متخصص في الإخراج السينمائي والإنتاج الفني. تقدم نصائح احترافية حول:
- زوايا التصوير واللقطات السينمائية
- الإضاءة وتقنيات التصوير
- الإخراج والتوجيه الفني
- تحليل السيناريو وبناء المشاهد

You are an intelligent assistant specializing in film directing and production. You provide professional advice on:
- Camera angles and cinematography
- Lighting and filming techniques
- Directing and artistic direction
- Script analysis and scene construction

اجب باللغة العربية بشكل واضح ومهني، وقدم أمثلة عملية عند الحاجة.
Answer in clear and professional Arabic, and provide practical examples when needed.`;

    const fullPrompt = `${conversationContext}المستخدم / User: ${message}`;

    // Create a ReadableStream for streaming the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Use the streaming function from gemini-core
          const aiStream = streamFlash(fullPrompt, {
            systemInstruction,
            temperature: 0.7,
          });

          // Stream chunks to the client as they arrive
          for await (const chunk of aiStream) {
            const data = JSON.stringify({ chunk }) + '\n';
            controller.enqueue(encoder.encode(data));
          }

          // Send completion signal
          controller.enqueue(encoder.encode(JSON.stringify({ done: true }) + '\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Streaming failed';
          controller.enqueue(
            encoder.encode(JSON.stringify({ error: errorMessage }) + '\n')
          );
          controller.close();
        }
      },
    });

    // Return the stream with appropriate headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
