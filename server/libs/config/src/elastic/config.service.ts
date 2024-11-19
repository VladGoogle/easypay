import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticConfigService {
  constructor(private readonly config: ConfigService) {}

  public get node(): string {
    return this.config.getOrThrow<string>('elastic.node');
  }

  public get user(): string {
    return this.config.getOrThrow<string>('elastic.user');
  }

  public get password(): string {
    return this.config.getOrThrow<string>('elastic.password');
  }
}
