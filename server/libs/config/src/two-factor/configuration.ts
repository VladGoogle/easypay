import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('two-factor-auth', () => {
  return {
    appName: env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
  };
});
