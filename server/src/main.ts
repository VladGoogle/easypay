import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';

import { AppConfigService } from '@libs/config';

import { AppModule } from './app';
import { registerHelpers } from '@libs/utils';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const config = app.get(AppConfigService);

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    express.json({
      type: [
        'application/json',
        'text/plain',
      ],
    }),
  );

  registerHelpers();

  await app.listen(config.port);

  Logger.log(
    `Listening at http://${config.host}:${config.port}/${globalPrefix}`,
  );
}

bootstrap();
