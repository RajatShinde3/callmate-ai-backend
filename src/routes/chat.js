// routes/chat.js

import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI with secret key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/chat → Generate AI response
router.post('/', async (req, res) => {
  const { message = '' } = req.body;

  // Validate input
  if (!message.trim()) {
    return res.status(400).json({ error: 'message_required' });
  }

  try {
    const startTime = Date.now();

    // Create chat completion using OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or switch to 'gpt-4o' or 'gpt-3.5-turbo'
      temperature: 0.3,
      max_tokens: 120,
      messages: [
        {
          role: 'system',
          content:
            'You are CallMate AI, a friendly customer support agent. Keep responses short, helpful, and professional.'
        },
        {
          role: 'user',
          content: message
        }
      ]
    });

    // Send back AI response with latency info
    res.json({
      reply: aiResponse.choices[0].message.content.trim(),
      latency_ms: Date.now() - startTime
    });
  } catch (err) {
    console.error('[OpenAI Error]', err);
    res.status(500).json({ error: 'openai_failed' });
  }
});

export default router;
