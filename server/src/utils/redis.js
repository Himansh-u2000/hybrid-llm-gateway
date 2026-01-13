import { createClient } from 'redis';

const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
  }
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

// IMPORTANT: connect explicitly
await redis.connect();

export default redis;
