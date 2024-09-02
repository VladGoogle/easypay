export interface RedisQueueConnection {
  db?: number;
  host: string;
  port: number;
}

export interface RedisCacheConnection {
  store: any;
  host: string;
  port: number;
}

export interface RedisDbs {
  queues: number;
  caches: number;
}
