import redis from '../utils/redis.js';

await redis.set(
  'api_key:dev-key-123',
  JSON.stringify({
    name: 'default',
    dailyLimit: 500,
    rateLimitPerMinute: 60
  })
);

console.log('✅ API key seeded');
process.exit();
