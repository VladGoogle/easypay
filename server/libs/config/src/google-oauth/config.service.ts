import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class GoogleOauthConfigService{
  constructor(private readonly config: ConfigService) {}

  public get clientId(): string {
    return this.config.getOrThrow<string>('google.clientId');
  }

  public get secret(): string {
    return this.config.getOrThrow<string>('google.secret');
  }

  public get redirectUrl(): string {
    return this.config.getOrThrow<string>('google.redirectUrl');
  }
}
