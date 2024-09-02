import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('sumsub', () => {
  return {
    token: env.SUMSUB_APP_TOKEN,
    secret: env.SUMSUB_SECRET_KEY,
  };
});
