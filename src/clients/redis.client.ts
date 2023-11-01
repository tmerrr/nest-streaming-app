import { createClient } from 'redis';

// defaults to localhost 6379
export const redisClient = createClient();
