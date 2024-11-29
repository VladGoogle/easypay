import { ArrayMaxSize, IsIn, IsOptional } from 'class-validator';

import { SplitToArray } from '@libs/decorators';
import { HasUniqueItems } from '@libs/validators';

const includeFields = [
  'ledgerTransaction',
  'ledgerTransaction.account',
  'ledgerTransaction.account.user',
] as const;

export class GetOneReceiptDTO {
  @IsOptional()
  @SplitToArray()
  @ArrayMaxSize(includeFields.length)
  @HasUniqueItems()
  @IsIn(includeFields, { each: true })
  include?: string[] = [];
}
