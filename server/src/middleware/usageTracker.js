import redis from '../utils/redis.js';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default async function usageTrackerMiddleware(req, reply) {
  const apiKey = req.apiKey;
  const keyConfig = req.apiKeyConfig;
  const today = getToday();

  const dailyLimit = keyConfig.dailyLimit ?? 500;

  const redisKey = `usage:${apiKey}:${today}`;
  const count = await redis.incr(redisKey);

  if (count === 1) {
    await redis.expire(redisKey, 60 * 60 * 24);
  }

  if (count > dailyLimit) {
    return reply.code(429).send({
      error: 'Daily limit exceeded',
      message: `Daily request limit of ${dailyLimit} exceeded`
    });
  }

  req.usage = {
    used: count,
    limit: dailyLimit
  };
}

export async function trackTokens(apiKey, tokens) {
  const today = getToday();
  const key = `tokens:${apiKey}:${today}`;

  await redis.incrBy(key, tokens);

  // expire after 24h
  await redis.expire(key, 60 * 60 * 24);
}
