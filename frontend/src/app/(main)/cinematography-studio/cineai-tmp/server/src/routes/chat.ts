dop\cineai-app\server\src\routes\chat.ts
</file_path>

<edit_description>
Create chat route for real-time assistant
</edit_description>
import { Request, Response } from 'express';
import OpenAI from 'openai';

export const chat = (openai: OpenAI) => async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
      max_tokens: 500,
    });
    const reply = response.choices[0].message.content || 'Sorry, I could not generate a response.';
    res.json({ reply });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
};
