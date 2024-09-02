import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SumsubConfigService {
  constructor(private readonly config: ConfigService) {}

  public get token(): string {
    return this.config.getOrThrow<string>('sumsub.token');
  }

  public get secret(): string {
    return this.config.getOrThrow<string>('sumsub.secret');
  }
}
