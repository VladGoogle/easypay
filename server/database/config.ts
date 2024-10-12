import * as dotenv from 'dotenv';
import { env } from 'node:process';
import {resolve} from "node:path";


dotenv.config({ path: resolve(__dirname, '../../.env') });

export default {
  type: 'postgres',
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT as string, 10),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: env.DB_TYPEORM_SYNCHRONIZE === 'true',
  logging: env.DB_TYPEORM_LOGGING === 'true',
  migrations: [env.DB_TYPEORM_MIGRATIONS || 'database/migration/**/*.ts'],
  migrationsTableName: 'migrations',
};
