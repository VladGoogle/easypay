import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AWSConfigService {
  constructor(private readonly config: ConfigService) {}

  get accessKey(): string {
    return this.config.getOrThrow<string>('aws.accessKey');
  }

  get secretKey(): string {
    return this.config.getOrThrow<string>('aws.secretKey');
  }

  get region(): string {
    return this.config.getOrThrow<string>('aws.region');
  }
}
