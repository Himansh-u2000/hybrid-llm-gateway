import { countTokens } from '../utils/tokenCounter.js';
import { stripThinking } from '../utils/cleanResponse.js';

const OLLAMA_URL = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL_NAME = 'deepseek-r1:1.5b';

export async function chatWithOllama(messages) {
  const prompt =
    messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n') +
    '\nASSISTANT:';

  const inputTokens = countTokens(prompt);

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL_NAME,
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama error: ${errText}`);
  }

  const data = await response.json();

  const cleanText = stripThinking(data.response || '');
  const outputTokens = countTokens(cleanText);

  return {
    content: cleanText,
    model: MODEL_NAME,
    tokens: {
      input: inputTokens,
      output: outputTokens,
      total: inputTokens + outputTokens
    }
  };
}
