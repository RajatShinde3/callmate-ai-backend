// src/routes/chat.js

import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/chat → Generate chat response
router.post('/', async (req, res) => {
  const { message = '' } = req.body ?? {};

  // Basic validation
  if (!message.trim()) {
    return res.status(400).json({ error: 'message_required' });
  }

  try {
    const start = Date.now();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // switched from gpt-4o-mini
      temperature: 0.3,
      max_tokens: 150,
      messages: [
        {
          role: 'system',
          content:
            'You are CallMate AI, a helpful, polite, and professional customer service assistant. Answer concisely and empathetically.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() || 'Sorry, I had trouble responding.';

    res.json({
      reply,
      latency_ms: Date.now() - start,
    });
  } catch (err) {
    console.error('[OpenAI Chat Error]', err);
    res.status(500).json({
      error: 'openai_failed',
      message: err.message || 'OpenAI API failed',
    });
  }
});

export default router;
