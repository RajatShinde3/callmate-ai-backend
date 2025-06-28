// routes/chat.js
// ─────────────────────────────────────────────────────────────
// Chat endpoint for CallMate AI
// POST /api/chat → { reply, latency_ms }
// Requires: OPENAI_API_KEY (set in your .env / Render)
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/chat
router.post('/', async (req, res) => {
  const { message = '' } = req.body ?? {};

  // Validate input
  if (!message.trim()) {
    return res.status(400).json({ error: 'message_required' });
  }

  try {
    const start = Date.now();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // safer option with broader access
      temperature: 0.3,
      max_tokens: 120,
      messages: [
        {
          role: 'system',
          content: 'You are CallMate AI, a helpful, concise and empathetic customer service assistant.'
        },
        {
          role: 'user',
          content: message
        }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || 'Sorry, I had trouble formulating a response.';

    res.json({
      reply,
      latency_ms: Date.now() - start
    });

  } catch (err) {
    console.error('[OpenAI] Chat completion failed:', err?.response?.data || err.message || err);

    res.status(500).json({
      error: 'openai_failed',
      message: err?.response?.data?.error?.message || err.message || 'Something went wrong while communicating with OpenAI.'
    });
  }
});

export default router;
