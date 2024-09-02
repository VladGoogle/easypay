import {Logger, ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {ValidationError} from "class-validator";
import {head} from "lodash";

import { AppConfigService } from '@libs/config';
import {ValidationException} from "@libs/exception-filters";

import { AppModule } from './app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: true
  });

  app.useGlobalPipes(
      new ValidationPipe({
        transform: true
      //   whitelist: true,
      //   forbidUnknownValues: true,
      //   exceptionFactory: (errors: ValidationError[]): ValidationException =>
      //       new ValidationException(head(errors)!),
      //
      }),
  )

  await app.listen(config.port);

  Logger.log(
    `Listening at http://${config.host}:${config.port}/${globalPrefix}`,
  );
}

bootstrap();
