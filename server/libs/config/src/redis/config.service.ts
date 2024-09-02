import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';



import {
  RedisCacheConnection,
  RedisQueueConnection,
} from './config.interface';

@Injectable()
export class RedisConfigService {
  constructor(private readonly configService: ConfigService) {}

  public get host(): string {
    return this.configService.getOrThrow<string>('redis.host');
  }

  public get port(): string {
    return this.configService.getOrThrow<string>('redis.port');
  }

  public get connForQueues(): RedisQueueConnection {
    return {
      host: this.host,
      port: parseInt(this.port, 10)
    };
  }

  public get connForCaches(): RedisCacheConnection {
    return {
      store: redisStore,
      host: this.host,
      port: parseInt(this.port, 10)
    };
  }


}
