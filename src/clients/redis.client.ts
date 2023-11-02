import { createClient } from 'redis';

// defaults to localhost 6379
export const redisClient = createClient();

// redisClient.set('foo', Buffer.from([]), { EX: 86_400 });
