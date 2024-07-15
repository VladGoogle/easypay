import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppConfigService } from '@libs/config';
import { AppModule } from './app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors();

  await app.listen(config.port, config.host);

  Logger.log(
    `Listening at http://${config.host}:${config.port}/${globalPrefix}`,
  );
}

bootstrap();
