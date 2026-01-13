import redis from '../utils/redis.js';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default async function usageRoute(app) {
  app.get('/usage', async (req, reply) => {
    const today = getToday();
    const tokenKey = `tokens:${req.apiKey}:${today}`;

    const tokensUsed = Number(await redis.get(tokenKey)) || 0;

    return {
      apiKey: req.apiKey,
      requests: req.usage,
      tokens: {
        used: tokensUsed
      },
      rateLimit: {
        perMinute: req.apiKeyConfig.rateLimitPerMinute
      }
    };
  });
}
