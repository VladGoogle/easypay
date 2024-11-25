import {
  DirectionType,
  TransactionStatus,
  TransactionType,
} from '@libs/enums/transaction';
import { Currency } from '@libs/enums/accounts';

export interface TransactionDetailsVars {
  ledgerId: string;
  amount: number;
  tax?: number;
  type: TransactionType;
  currency: Currency;
  directionType: DirectionType;
  status: TransactionStatus;
  pitBalanceBefore: number;
  pitBalanceAfter: number;
  transactionDate: string;
}
