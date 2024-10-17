import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('firebase', () => ({
  projectId: env.FIREBASE_PROJECT_ID,
  privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: env.FIREBASE_CLIENT_EMAIL,
}));
