import { ReceiptVars } from './vars.interface';

export interface ReceiptPayload {
  userId: string;
  templatePath: string;
  logoPath: string;
  tokens?: string[];
  s3Key: string;
  vars: ReceiptVars;
}
