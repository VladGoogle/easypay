import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwoFactorConfigService {
  constructor(private readonly config: ConfigService) {}

  public get appName(): string {
    return this.config.getOrThrow<string>('two-factor-auth.appName');
  }
}
