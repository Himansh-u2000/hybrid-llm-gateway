import { routeChat } from '../utils/router.js';
import { trackTokens } from '../middleware/usageTracker.js';
import { streamWithOllama } from '../services/ollamaStream.js';

export default async function chatRoute(app) {
  app.post('/chat/completions', async (req, reply) => {
    const { messages, model } = req.body;
    const stream = req.query.stream === 'true';

    if (!messages || !Array.isArray(messages)) {
      return reply.code(400).send({
        error: 'Invalid request',
        message: 'messages must be an array'
      });
    }

    // 🔥 STREAMING PATH
    if (stream) {
      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Cache-Control', 'no-cache');
      reply.raw.setHeader('Connection', 'keep-alive');

      await streamWithOllama(reply.raw, messages);
      return; // ⚠️ DO NOT RETURN DATA
    }

    // 🔁 NON-STREAMING PATH
    const result = await routeChat({
      messages,
      modelPreference: model === 'gpt-oss-120b' ? 'large' : 'local'
    });

    await trackTokens(req.apiKey, result.tokens.total);

    return {
      id: 'chatcmpl-hybrid',
      object: 'chat.completion',
      provider: result.routedTo,
      usage: {
        prompt_tokens: result.tokens.input,
        completion_tokens: result.tokens.output,
        total_tokens: result.tokens.total
      },
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: result.content
          },
          finish_reason: 'stop'
        }
      ]
    };
  });
}
