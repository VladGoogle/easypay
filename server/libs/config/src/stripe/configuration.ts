import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('stripe', () => {
  return {
    secret: env.STRIPE_SECRET,
  };
});
