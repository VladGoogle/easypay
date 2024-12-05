import { registerAs } from '@nestjs/config';
import { env } from 'node:process';

export default registerAs('aws', () => {
  return {
    accessKey: env.AWS_ACCESS_KEY,
    secretKey: env.AWS_SECRET_KEY,
    region: env.AWS_REGION,
    receiptsBucket: env.AWS_RECEIPTS_BUCKET,
    invoicesBucket: env.AWS_INVOICES_BUCKET
  };
});
