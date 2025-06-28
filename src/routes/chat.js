// NEW FILE
import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { message = '' } = req.body;
  if (!message.trim()) return res.status(400).json({ error: 'message_required' });

  try {
    const t0 = Date.now();
    const ai = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 120,
      messages: [
        { role: 'system', content: 'You are CallMate AI, a friendly customer‑support agent. Keep responses concise and helpful.' },
        { role: 'user', content: message }
      ]
    });

    res.json({
      reply: ai.choices[0].message.content.trim(),
      latency_ms: Date.now() - t0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'openai_failed' });
  }
});

export default router;
