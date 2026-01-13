import redis from '../utils/redis.js';

export default async function authMiddleware(req, reply) {
  const apiKey = req.headers['x-api-key']?.trim();

  if (!apiKey) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Missing API key'
    });
  }

  const keyDataRaw = await redis.get(`api_key:${apiKey}`);

  if (!keyDataRaw) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'API key configuration not found'
    });
  }

  // Attach to request ONCE
  req.apiKey = apiKey;
  req.apiKeyConfig = JSON.parse(keyDataRaw);
}
