import redis from '../utils/redis.js';

export default async function rateLimitMiddleware(req, reply) {
  const apiKey = req.apiKey; // set by auth middleware
  const limit = Number(process.env.RATE_LIMIT_PER_MINUTE || 60);

  const redisKey = `rate_limit:${apiKey}`;

  // Increment request count
  const currentCount = await redis.incr(redisKey);

  // If this is the first request, set expiry
  if (currentCount === 1) {
    await redis.expire(redisKey, 60);
  }

  // If limit exceeded → block
  if (currentCount > limit) {
    return reply.code(429).send({
      error: 'Rate limit exceeded',
      message: `Max ${limit} requests per minute exceeded`
    });
  }
}
