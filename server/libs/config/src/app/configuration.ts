import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('app', () => {
  return {
    host: env.HOST,
    port: parseInt(<string>env.PORT, 10),
  };
});
