import dotenv from 'dotenv';
dotenv.config(); // harmless locally, ignored in prod
import Fastify from 'fastify';
import chatRoute from './routes/chat.js';
import authMiddleware from './middleware/auth.js';
import rateLimitMiddleware from './middleware/rateLimit.js';
import usageTrackerMiddleware from './middleware/usageTracker.js';
import redis from './utils/redis.js';
import usageRoute from './routes/usage.js';

const app = Fastify({ logger: true });

app.addHook('preHandler', authMiddleware);
app.addHook('preHandler', rateLimitMiddleware);
app.addHook('preHandler', usageTrackerMiddleware);

app.register(chatRoute, { prefix: '/v1' });
app.register(usageRoute, { prefix: '/v1' });

export default app;
