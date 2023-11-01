import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { redisClient } from './clients/redis.client';

async function bootstrap() {
  await redisClient.connect();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
