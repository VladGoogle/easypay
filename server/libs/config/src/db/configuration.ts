import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('db', () => ({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  debug: false,
  logging: Boolean(env.DB_TYPEORM_LOGGING) || false,
}));

