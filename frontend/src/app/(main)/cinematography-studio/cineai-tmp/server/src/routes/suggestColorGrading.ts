dop\cineai-app\server\src\routes\suggestColorGrading.ts
import { Request, Response } from 'express';
import OpenAI from 'openai';

export const suggestColorGrading = (openai: OpenAI) => async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Media file is required' });
  }
  try {
    // Simulate analysis; in real app, use vision or color analysis
    const prompt = 'Suggest color grading adjustments for this media to enhance mood and consistency in cinematography.';
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });
    const gradesText = response.choices[0].message.content;
    // Mock grades
    const grades = [
      { description: 'Boost shadows for more depth' },
      { description: 'Add warmth to highlights' }
    ];
    res.json({ grades });
  } catch (error) {
    console.error('Error suggesting color grading:', error);
    res.status(500).json({ error: 'Failed to suggest color grading' });
  }
};
