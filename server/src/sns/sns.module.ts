import { Module } from '@nestjs/common';

import { AWSClientModule } from '@libs/aws-client';
import { AWSConfigModule } from '@libs/config';

import {
  ConfirmNotificationHandlerService,
  S3NotificationHandlerService,
} from './handlers';
import { SnsController } from './sns.controller';
import { SnsService } from './sns.service';

@Module({
  imports: [AWSConfigModule, AWSClientModule],
  controllers: [SnsController],
  providers: [
    SnsService,
    ConfirmNotificationHandlerService,
    S3NotificationHandlerService,
  ],
})
export class SnsModule {}
