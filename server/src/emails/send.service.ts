import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {
  SendEmailCommand,
  SendEmailCommandInput,
  SESClient
} from '@aws-sdk/client-ses';
import * as juice from 'juice';

import {AWSConfigService, MailerConfigService} from '@libs/config';

import {RenderTemplateInterface} from "./interfaces";
import { TemplateService } from './template.service';
import {SendMail} from "@libs/interfaces/mailer";

@Injectable()
export class SendService implements OnModuleInit {

  private sesClient: SESClient;

  private readonly logger = new Logger(SendService.name);

  constructor(
    private readonly awsConfig: AWSConfigService,
    private readonly mailConfig: MailerConfigService,
    private readonly tpl: TemplateService,
  ) {}

  onModuleInit(): any {
    this.sesClient = new SESClient({
      credentials: {
        accessKeyId: this.awsConfig.accessKey,
        secretAccessKey: this.awsConfig.secretKey,
      },
      region: this.awsConfig.region,
    });
  }


  public async sendTemplate(dto: SendMail): Promise<void> {
    const mailOptions = await this.preparePayload(dto);

    const command = new SendEmailCommand(mailOptions);
    await this.sesClient.send(command);

    this.logger.log(`Sent: ${dto.template}, ${dto.to}, ${dto.subject}`);
  }


  private async preparePayload(dto: SendMail): Promise<SendEmailCommandInput> {
    const html = await this.renderTpl(dto);

    return {
      Source: this.mailConfig.fromMail,
      Destination: {
        ToAddresses: [dto.to],
      },
      Message: {
        Subject: {
          Data: dto.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: html,
            Charset: 'UTF-8',
          },
        },
      },
    };
  }


  private async renderTpl(data: RenderTemplateInterface): Promise<string> {
    const vars: Record<string, unknown> = {};

    data.variables.forEach((i) => (vars[i.name] = i.content));

    const html = await this.tpl.render(data.template, vars);

    return juice(html);
  }
}
