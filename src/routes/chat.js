// src/routes/chat.js
// ─────────────────────────────────────────────────────────────
// Secure, production‑ready Chat endpoint for CallMate AI
// • POST  /api/chat        →  { reply, latency_ms }
// • Requires:  OPENAI_API_KEY   (set in your Render / .env)
// • Uses:  OpenAI “gpt‑4o‑mini”  (feel free to upgrade)
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

/* Initialise OpenAI once (kept hot in serverless containers) */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* POST /api/chat
   Body: { "message": "text from user…" } */
router.post('/', async (req, res) => {
  const { message = '' } = req.body ?? {};

  /* Basic validation */
  if (!message.trim()) {
    return res.status(400).json({ error: 'message_required' });
  }

  try {
    const start = Date.now();

    const completion = await openai.chat.completions.create({
      /* ↳ MODEL
         - gpt‑4o‑mini  (cheap + fast)
         - gpt‑4o       (higher quality)
         - gpt‑3.5‑turbo (cheapest)
         swap as you prefer */
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 120,
      messages: [
        {
          role: 'system',
          content:
            'You are **CallMate AI**, a concise, empathetic customer‑support assistant. Always be helpful, polite, and professional.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() || 'Sorry, I had trouble formulating a response.';

    return res.json({
      reply,
      latency_ms: Date.now() - start,
    });
  } catch (err) {
    console.error('[OpenAI] Chat completion failed:', err);
    return res.status(500).json({ error: 'openai_failed' });
  }
});

export default router;
