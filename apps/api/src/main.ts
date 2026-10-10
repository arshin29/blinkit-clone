import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for future React applications (customer, admin, rider)
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );

  // Support both root routes (e.g. /cart/*, /auth/*, /health) and prefixed routes (/api/*)
  app.use((req: any, res: any, next: any) => {
    if (!req.url.startsWith('/api')) {
      req.url = `/api${req.url}`;
      req.originalUrl = `/api${req.originalUrl}`;
    }
    next();
  });

  // Global API route prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Blinkit API is running on: http://localhost:${port}/api`);
  console.log(`🏥 Health check: http://localhost:${port}/api/health`);
}
bootstrap();
