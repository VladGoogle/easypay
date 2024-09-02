import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envFilePath } from '../util';
import { RedisConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath,
    }),
  ],
  providers: [RedisConfigService],
  exports: [RedisConfigService],
})
export class RedisConfigModule {}
