import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('jwt', () => {
  return {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    adminSecret: env.JWT_ADMIN_SECRET,
    adminRefreshSecret: env.JWT_ADMIN_REFRESH_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    resetSecret: env.JWT_RESET_SECRET,
    resetAdminSecret: env.JWT_ADMIN_RESET_SECRET,
    resetExpiresIn: env.JWT_RESET_EXPIRES_IN,
  };
});
