import { TransactionDetailsVars } from './transaction-details-vars.interface';
import { AccountVars } from './account-vars.interface';

export interface InvoiceVars {
  fullName: string;
  invoiceDate: string;
  logoPath: string;
  dateRange: string[];
  beforeBalance: number;
  afterBalance: number;
  accountVars: AccountVars;
  transactionVars: TransactionDetailsVars[];
}
