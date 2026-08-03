const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'qwen/qwen3.6-27b';
const FALLBACK_MODEL = 'openai/gpt-oss-20b';

function uniqueModels(...models) {
  return [...new Set(models.map((model) => model?.trim()).filter(Boolean))];
}

function isRetryableModelError(status, message) {
  const text = String(message || '').toLowerCase();
  return (
    status === 400 && (
      text.includes('tool choice is none') ||
      text.includes('called a tool') ||
      text.includes('tool call') ||
      text.includes('reasoning') ||
      (text.includes('model') && (
        text.includes('decommission') ||
        text.includes('not found') ||
        text.includes('invalid') ||
        text.includes('unsupported')
      ))
    )
  ) || status === 404 || status === 410 || status === 429 || (status === 403 && (text.includes('blocked') || text.includes('restricted') || text.includes('permission')));
}

function buildRequestBody(model, messages, maxTokens) {
  const body = {
    model,
    messages,
    temperature: 0.25,
    max_completion_tokens: maxTokens,
    stream: false,
    tool_choice: 'none'
  };

  if (model.startsWith('qwen/')) {
    body.reasoning_effort = 'none';
    body.reasoning_format = 'hidden';
  }

  return body;
}

async function requestGroq({ apiKey, model, messages, maxTokens }) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buildRequestBody(model, messages, maxTokens))
  });

  const raw = await response.text();
  let data;

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { error: { message: raw || 'Groq returned an invalid response.' } };
  }

  const message = data?.error?.message || data?.message || 'Groq API request failed.';
  const content = data?.choices?.[0]?.message?.content?.trim();
  const attemptedToolCall = Array.isArray(data?.choices?.[0]?.message?.tool_calls)
    && data.choices[0].message.tool_calls.length > 0;

  return { response, data, message, content, attemptedToolCall };
}

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

    const maxTokens = Math.min(Math.max(Number(body.max_tokens) || 500, 100), 800);
    const models = uniqueModels(
      process.env.GROQ_MODEL,
      body.model,
      DEFAULT_MODEL,
      FALLBACK_MODEL
    );

    let lastFailure;

    for (const model of models) {
      const result = await requestGroq({ apiKey, model, messages, maxTokens });

      if (result.response.ok && result.content && !result.attemptedToolCall) {
        return res.status(200).json({ text: result.content });
      }

      const failureMessage = result.attemptedToolCall
        ? 'The model attempted an unsupported tool call.'
        : result.message;

      lastFailure = {
        status: result.response.status || 502,
        message: failureMessage,
        details: result.data,
        model
      };

      if (!result.attemptedToolCall && !isRetryableModelError(result.response.status, failureMessage)) {
        break;
      }

      console.warn(`MediCheck retrying after model failure (${model}):`, failureMessage);
    }

    console.error('MediCheck Groq failure:', lastFailure);
    return res.status(lastFailure?.status || 502).json({
      error: 'The AI service could not generate a reply. Please try again.',
      details: lastFailure?.details
    });
  } catch (error) {
    console.error('MediCheck API error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unexpected server error.'
    });
  }
}
