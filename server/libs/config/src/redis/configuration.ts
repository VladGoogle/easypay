import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('redis', () => ({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  dbs: {
    caches: 1,
    queues: 1,
  },
  retryAttempts: 10,
  retryDelay: 30000,
}));
