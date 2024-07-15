import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('db', () => ({
  type: 'postgres',
  url: env.DB_CONNECTION_STRING,
  debug: false,
  logging: Boolean(env.DB_TYPEORM_LOGGING) || false,
  sslOptions: env.DB_SSL_OPTIONS,
}));
