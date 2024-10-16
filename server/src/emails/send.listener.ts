import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { Name } from '@libs/enums/queue';
import {SendMail} from "@libs/interfaces/mailer";

import { SendService } from './send.service';

@Processor(Name.Mail)
export class SendListener {
  private readonly logger = new Logger(SendListener.name);

  constructor(private readonly service: SendService) {}

  @Process({ name: 'send.template', concurrency: 1 })
  public async sendTemplate(job: Job<SendMail>): Promise<void> {
    try {
      await this.service.sendTemplate(job.data);
    } catch (error) {
      this.logger.error((error as Error).message, JSON.stringify(error));
    }
  }
}
