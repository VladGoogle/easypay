import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService {
  constructor(private readonly config: ConfigService) {}

  get fromMail(): string {
    return this.config.getOrThrow<string>('mailer.fromMail');
  }
}
