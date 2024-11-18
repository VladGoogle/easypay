import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('plaid', () => {
  return {
    clientId: env.PLAID_CLIENT_ID,
    secret: env.PLAID_SECRET,
  };
});
