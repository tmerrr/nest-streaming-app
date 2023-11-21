import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { db } from './clients/db.client';
import { redisClient } from './clients/redis.client';

async function bootstrap() {
  const [app] = await Promise.all([
    NestFactory.create(AppModule),
    db.initialize(),
    redisClient.connect(),
  ]);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
