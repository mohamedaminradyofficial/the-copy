import { Request, Response } from 'express';
import OpenAI from 'openai';

export const optimizeEquipment = (openai: OpenAI) => async (req: Request, res: Response) => {
  const { requirements } = req.body;
  if (!requirements) {
    return res.status(400).json({ error: 'Requirements are required' });
  }
  try {
    const prompt = `Based on the following project requirements, recommend optimal cinematography equipment including cameras, lenses, filters, and lighting equipment. Consider budget, location, and style:\n\n${requirements}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });
    const equipmentText = response.choices[0].message.content;
    // For simplicity, return as text; could parse into structured data
    res.json({ equipment: equipmentText?.split('\n') || [] });
  } catch (error) {
    console.error('Error optimizing equipment:', error);
    res.status(500).json({ error: 'Failed to optimize equipment' });
  }
};
