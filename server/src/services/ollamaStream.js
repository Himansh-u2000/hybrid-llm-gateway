const OLLAMA_URL = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL_NAME = 'deepseek-r1:1.5b';

export async function streamWithOllama(res, messages) {
  const prompt =
    messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n') +
    '\nASSISTANT:';

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL_NAME,
      prompt,
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(Boolean);

    for (const line of lines) {
      const json = JSON.parse(line);
      if (!json.response) continue;

      res.write(
        `data: ${JSON.stringify({
          choices: [
            { delta: { content: json.response } }
          ]
        })}\n\n`
      );
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
}
