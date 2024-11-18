import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envFilePath } from '../util';
import { PlaidConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath,
    }),
  ],
  providers: [PlaidConfigService],
  exports: [PlaidConfigService],
})
export class PlaidConfigModule {}
