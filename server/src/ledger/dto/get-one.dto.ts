import { ArrayMaxSize, IsIn, IsOptional } from 'class-validator';

import { SplitToArray } from '@libs/decorators';
import { HasUniqueItems } from '@libs/validators';

const includeFields = [
  'transaction',
  'transaction.senderAccount',
  'transaction.receiverAccount',
] as const;

export class GetOneLedgerTransactionsDTO {
  @IsOptional()
  @SplitToArray()
  @ArrayMaxSize(includeFields.length)
  @HasUniqueItems()
  @IsIn(includeFields, { each: true })
  include?: string[] = [];
}
