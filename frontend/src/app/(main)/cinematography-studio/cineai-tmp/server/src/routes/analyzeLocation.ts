import { Request, Response } from 'express';
import OpenAI from 'openai';

export const analyzeLocation = (openai: OpenAI) => async (req: Request, res: Response) => {
  const { locationUrl } = req.body;
  if (!locationUrl) {
    return res.status(400).json({ error: 'Location URL is required' });
  }
  try {
    // Simulate analysis using GPT; in real app, integrate with vision API
    const prompt = `Analyze the following location for cinematography: ${locationUrl}. Provide lighting analysis throughout the day and camera placement suggestions.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });
    const analysisText = response.choices[0].message.content;
    // Parse or structure the response; for simplicity, return as is
    res.json({ analysis: analysisText });
  } catch (error) {
    console.error('Error analyzing location:', error);
    res.status(500).json({ error: 'Failed to analyze location' });
  }
};
