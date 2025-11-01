import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import OpenAI from 'openai';

// Import route handlers
import { generateImages } from './routes/generateImages';
import { analyzeLocation } from './routes/analyzeLocation';
import { generateShots } from './routes/generateShots';
import { optimizeEquipment } from './routes/optimizeEquipment';
import { validateShot } from './routes/validateShot';
import { chat } from './routes/chat';
import { analyzeFootage } from './routes/analyzeFootage';
import { suggestColorGrading } from './routes/suggestColorGrading';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
app.post('/api/generate-images', generateImages(openai));
app.post('/api/analyze-location', analyzeLocation(openai));
app.post('/api/generate-shots', generateShots(openai));
app.post('/api/optimize-equipment', optimizeEquipment(openai));
app.post('/api/validate-shot', upload.single('shot'), validateShot(openai));
app.post('/api/chat', chat(openai));
app.post('/api/analyze-footage', upload.single('footage'), analyzeFootage(openai));
app.post('/api/suggest-color-grading', upload.single('media'), suggestColorGrading(openai));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
