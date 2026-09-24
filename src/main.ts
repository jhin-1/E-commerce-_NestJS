import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import env from './config/env.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    routeConflictPolicy: { duplicate: 'error', shadow: 'warn' }, // for duplicate routes
  });
  await app.listen(env.PORT || 3001, () =>
    console.log(`Server is running on port ${env.PORT || 3001}`),
  );

}
await bootstrap();
