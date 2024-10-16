import { Module } from '@nestjs/common';

import {AWSConfigModule, MailerConfigModule} from '@libs/config';

import { SendListener } from './send.listener';
import { SendService } from './send.service';
import { TemplateService } from './template.service';

@Module({
  imports: [
    AWSConfigModule,
    MailerConfigModule,
  ],
  providers: [SendListener, SendService, TemplateService],
})
export class SendModule {}
