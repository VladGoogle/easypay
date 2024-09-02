import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envFilePath } from '../util';
import {StripeConfigService} from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath,
    }),
  ],
  providers: [StripeConfigService],
  exports: [StripeConfigService],
})
export class StripeConfigModule {}
