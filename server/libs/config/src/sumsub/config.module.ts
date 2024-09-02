import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envFilePath } from '../util';
import {SumsubConfigService} from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath,
    }),
  ],
  providers: [SumsubConfigService],
  exports: [SumsubConfigService],
})
export class SumsubConfigModule {}
