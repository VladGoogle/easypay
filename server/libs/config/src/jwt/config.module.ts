import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envFilePath } from '../util';
import {JwtConfigService} from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath,
    }),
  ],
  providers: [JwtConfigService],
  exports: [JwtConfigService],
})
export class JwtConfigModule {}
