import express from 'express';
import { queryGemini } from '../services/gemini.service';

const router = express.Router();

router.post('/', async (req, res) => {
  const { prompt } = req.body;
   console.log('Prompt recibido:', prompt);

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await queryGemini(prompt);
    res.status(200).json({ result: response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get response from Gemini' });
  }
});

export default router;
