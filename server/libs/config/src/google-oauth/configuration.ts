import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('google', () => ({
  clientId: env.OAUTH_GOOGLE_ID,
  secret: env.OAUTH_GOOGLE_SECRET,
  redirectUrl: env.OAUTH_GOOGLE_REDIRECT_URL,
}));
