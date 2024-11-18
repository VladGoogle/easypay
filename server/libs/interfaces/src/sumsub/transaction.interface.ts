import { Currency } from '@libs/enums/accounts';

export interface SumsubTransaction {
  applicantId: string;
  transactionId: string;
  amount: number;
  currency: Currency;
  date: Date;
  paymentDetails?: string;
  accountId: string;
  country: string;
  bic: string;
}
