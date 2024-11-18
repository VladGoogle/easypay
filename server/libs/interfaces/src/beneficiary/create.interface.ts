import { TransactionType } from '@libs/enums/transaction';

export interface CreateBeneficiary {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userId?: string;
  type: TransactionType;
  accountId?: string;
  details?: object;
}
