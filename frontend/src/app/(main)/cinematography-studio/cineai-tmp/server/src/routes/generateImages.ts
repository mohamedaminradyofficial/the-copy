import { Request, Response } from 'express';
import OpenAI from 'openai';

export const generateImages = (openai: OpenAI) => async (req: Request, res: Response) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }
  try {
    const response = await openai.images.generate({
      prompt: description,
      n: 3, // Generate 3 images
      size: '1024x1024',
    });
    const images = response.data.map((image: any) => image.url);
    res.json({ images });
  } catch (error) {
    console.error('Error generating images:', error);
    res.status(500).json({ error: 'Failed to generate images' });
  }
};
