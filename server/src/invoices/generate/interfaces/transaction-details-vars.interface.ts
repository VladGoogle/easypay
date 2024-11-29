import { DirectionType } from '@libs/enums/transaction';

export interface TransactionDetailsVars {
  amount: number;
  tax?: number;
  total: number;
  directionType: DirectionType;
  pitBalanceBefore: number;
  pitBalanceAfter: number;
  createdAt: string;
}
