import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('elastic', () => ({
  node: env.ELASTICSEARCH_NODE,
  user: env.ELASTICSEARCH_USERNAME,
  password: env.ELASTIC_PASSWORD,
}));
