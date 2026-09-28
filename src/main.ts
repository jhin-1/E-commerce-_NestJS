import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import env from './config/env.service.js';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './common/services/redis/redis.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    routeConflictPolicy: { duplicate: 'error', shadow: 'warn' }, // for duplicate routes
  });
  let port = app.get(ConfigService).getOrThrow<number>('PORT');

  // connection redis
  await app.listen(port || 3001, () =>
    console.log(`Server is running on port ${port || 3001}`),
  );
}
await bootstrap();
