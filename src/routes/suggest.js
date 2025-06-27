// src/routes/suggest.js
import { Router } from "express";
import Sentiment from "sentiment";

const router = Router();
const sentiment = new Sentiment();

// Check if OpenAI is available
const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_key_here';
let openai = null;

if (hasOpenAI) {
  try {
    const OpenAI = (await import('openai')).default;
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (error) {
    console.warn('OpenAI module not available:', error.message);
  }
}

router.post("/", async (req, res) => {
  const { text = "", call_id = "demo" } = req.body || {};

  if (!text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }

  try {
    const startTime = Date.now();
    let suggestion = "";
    let confidence = 0.7;

    if (openai && hasOpenAI) {
      // Use OpenAI if available
      const ai = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 120,
        messages: [
          {
            role: "system",
            content:
              "You are CallMate AI, a helpful, concise voice assistant for customer support.",
          },
          { role: "user", content: text },
        ],
      });

      suggestion = ai.choices?.[0]?.message?.content?.trim() || "";
      confidence = ai.usage?.completion_tokens && ai.usage.completion_tokens > 0
        ? Math.min(1, ai.usage.completion_tokens / 120)
        : 0.7;
    } else {
      // Fallback response when OpenAI is not available
      suggestion = "I understand your message. Please configure OpenAI API key for AI-powered responses.";
      confidence = 0.5;
    }

    const latency_ms = Date.now() - startTime;
    const sentimentScore = sentiment.analyze(text).comparative;
    const mood =
      sentimentScore > 0.2
        ? "positive"
        : sentimentScore < -0.2
        ? "negative"
        : "neutral";

    res.json({
      suggestion,
      latency_ms,
      sentiment: mood,
      confidence,
      call_id,
      ai_enabled: hasOpenAI,
    });
  } catch (err) {
    console.error("AI Suggestion Error:", err.message || err);
    res.status(500).json({ error: "AI service failed", detail: err.message });
  }
});

export default router;