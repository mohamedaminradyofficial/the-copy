import { Request, Response } from 'express';
import OpenAI from 'openai';

export const generateShots = (openai: OpenAI) => async (req: Request, res: Response) => {
  const { script } = req.body;
  if (!script) {
    return res.status(400).json({ error: 'Script is required' });
  }
  try {
    const prompt = `Based on the following script, generate a detailed shot list for cinematography. Include scene descriptions, shot types, camera angles, and any relevant notes:\n\n${script}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });
    const shotListText = response.choices[0].message.content;
    // For simplicity, return as text; could parse into array
    res.json({ shots: shotListText?.split('\n') || [] });
  } catch (error) {
    console.error('Error generating shots:', error);
    res.status(500).json({ error: 'Failed to generate shot list' });
  }
};
