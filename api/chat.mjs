const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-20b';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY is missing from the Vercel project environment variables.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const history = Array.isArray(body.messages) ? body.messages : [];
    const messages = [];

    if (typeof body.system === 'string' && body.system.trim()) {
      messages.push({ role: 'system', content: body.system.trim() });
    }

    for (const message of history) {
      if (
        message &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string' &&
        message.content.trim()
      ) {
        messages.push({ role: message.role, content: message.content.trim() });
      }
    }

    if (!messages.some((message) => message.role === 'user')) {
      return res.status(400).json({ error: 'A user message is required.' });
    }

    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL?.trim() || body.model || DEFAULT_MODEL,
        messages,
        temperature: 0.35,
        max_completion_tokens: Math.min(Number(body.max_tokens) || 800, 1200),
        stream: false
      })
    });

    const raw = await groqResponse.text();
    let data;

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = { error: { message: raw || 'Groq returned an invalid response.' } };
    }

    if (!groqResponse.ok) {
      const message = data?.error?.message || data?.message || 'Groq API request failed.';
      return res.status(groqResponse.status).json({ error: message, details: data });
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return res.status(502).json({ error: 'Groq returned an empty response.' });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error('MediCheck API error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unexpected server error.'
    });
  }
}
