import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('mailer', () => ({
  fromMail: env.SES_FROM_MAIL,
}));
