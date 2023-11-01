import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { redisClient } from './redisClient';

async function bootstrap() {
  await redisClient.connect();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
