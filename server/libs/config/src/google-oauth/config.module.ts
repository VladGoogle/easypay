import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './configuration';
import {GoogleOauthConfigService} from "./config.service";
import { envFilePath } from '../util';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath,
    }),
  ],
  providers: [GoogleOauthConfigService],
  exports: [GoogleOauthConfigService],
})
export class GoogleOauthConfigModule {}
