import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  public get host(): string {
    return this.config.getOrThrow<string>('app.host');
  }

  public get frontendPort(): number {
    return this.config.getOrThrow<number>('app.frontendPort');
  }

  public get port(): number {
    return this.config.getOrThrow<number>('app.port');
  }
}
