// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import compression from '@fastify/compress';
import { AllExceptionsFilter } from './app.exception';

import { contentParser } from 'fastify-multer';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  // Set app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(contentParser);

  // app.useStaticAssets({ root: join(__dirname, './../media') });

  // Cors domain
  app.enableCors({
    // origin: true,
    credentials: true,
    preflightContinue: true,
    origin: ['http://localhost:3000', 'http://localhost:3002'],
  });

  // Catch exception
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter());

  // Security
  await app.register(fastifyCsrf);
  await app.register(helmet);
  // await app.register(plugin);

  // Register cookie
  await app.register(fastifyCookie, {
    secret: process.env.KEY_COOKIE,
    hook: 'onRequest',
    parseOptions: {}, // options for parsing cookies
  });

  // Compress decrease size of api when send to client
  await app.register(compression, { encodings: ['gzip', 'deflate'] });

  // Prefix of api
  app.setGlobalPrefix('api/v1');

  // Config swagger
  const config = new DocumentBuilder()
    .setTitle('API Server')
    .setDescription('API Server Endpoints')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
