/** @format */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import * as express from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';

/* 🔥 REDIS ADAPTER */
import { RedisIoAdapter } from './adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new Logger('Bootstrap');

  /* ================================================= */
  /* 🔐 SECURITY (HELMET)                              */
  /* ================================================= */

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  /* ================================================= */
  /* 📦 BODY PARSER                                    */
  /* ================================================= */

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));

  /* ================================================= */
  /* 🌐 CORS                                           */
  /* ================================================= */

  app.enableCors({
    origin: true,
    credentials: true,
  });

  /* ================================================= */
  /* 🧠 PREFIX                                         */
  /* ================================================= */

  app.setGlobalPrefix('api');

  /* ================================================= */
  /* ✅ VALIDATION                                     */
  /* ================================================= */

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /* ================================================= */
  /* 🚨 ERROR FILTER                                   */
  /* ================================================= */

  app.useGlobalFilters(new HttpExceptionFilter());

  /* ================================================= */
  /* 🌍 TRUST PROXY                                    */
  /* ================================================= */

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  /* ================================================= */
  /* 🔥 REDIS SOCKET ADAPTER (PRODUCTION)              */
  /* ================================================= */

  try {
    const redisAdapter = new RedisIoAdapter(app);
    await redisAdapter.connectToRedis();

    app.useWebSocketAdapter(redisAdapter);

    logger.log('⚡ Redis WebSocket adapter enabled');
  } catch (err) {
    logger.error('❌ Redis init failed:', err);
  }

  /* ================================================= */
  /* 🚀 START SERVER                                   */
  /* ================================================= */

  const port = process.env.PORT || 5000;

  await app.listen(port);

  logger.log(`🚀 Server running on http://localhost:${port}/api`);
}

bootstrap();
