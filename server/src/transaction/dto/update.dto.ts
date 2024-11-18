import { IsEnum } from 'class-validator';
import { TransactionStatus } from '@libs/enums/transaction';

export class UpdateTransactionDTO {
  @IsEnum(TransactionStatus)
  status!: TransactionStatus;
}
