import { InvoiceVars } from './vars.interface';

export interface InvoicePayload {
  userId: string;
  accountId: string;
  templatePath: string;
  logoPath: string;
  tokens?: string[];
  s3Key: string;
  vars: InvoiceVars;
}
