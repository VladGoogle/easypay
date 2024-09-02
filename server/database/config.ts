import * as dotenv from 'dotenv';
import { env } from 'node:process';
import {resolve} from "node:path";


dotenv.config({ path: resolve(__dirname, '../../.env') });

export default {
  type: 'postgres',
  url: env.DB_LOCAL_CONNECTION_STRING,
  synchronize: env.DB_TYPEORM_SYNCHRONIZE === 'true',
  logging: env.DB_TYPEORM_LOGGING === 'true',
  migrations: [env.DB_TYPEORM_MIGRATIONS || 'database/migration/**/*.ts'],
  migrationsTableName: 'migrations',
};
