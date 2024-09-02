import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private readonly config: ConfigService) {}

  public get secret(): string {
    return this.config.getOrThrow<string>('jwt.secret');
  }

  public get refreshSecret(): string {
    return this.config.getOrThrow<string>('jwt.refreshSecret');
  }

  public get expiresIn(): string {
    return this.config.getOrThrow<string>('jwt.expiresIn');
  }

  public get refreshExpiresIn(): string {
    return this.config.getOrThrow<string>('jwt.refreshExpiresIn');
  }
}
