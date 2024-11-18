import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlaidConfigService {
  constructor(private readonly config: ConfigService) {}

  public get clientId(): string {
    return this.config.getOrThrow<string>('plaid.clientId');
  }

  public get secret(): string {
    return this.config.getOrThrow<string>('plaid.secret');
  }
}
