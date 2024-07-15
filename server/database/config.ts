import * as dotenv from 'dotenv';
import { env } from 'node:process';

dotenv.config();

export default {
  type: 'postgres',
  url: env.DB_CONNECTION_STRING,
  synchronize: env.DB_TYPEORM_SYNCHRONIZE === 'true',
  logging: env.DB_TYPEORM_LOGGING === 'true',
  migrations: [env.DB_TYPEORM_MIGRATIONS || 'database/migration/**/*.ts'],
  migrationsTableName: 'migrations',
};
