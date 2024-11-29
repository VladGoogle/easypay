import { HasUniqueItems } from '@libs/validators';
import { ArrayMaxSize, IsIn, IsOptional } from 'class-validator';
import { SplitToArray } from '@libs/decorators';

const includeFields = ['ledgerTransactions', 'invoices'] as const;

export class GetOneAccountDTO {
  @IsOptional()
  @SplitToArray()
  @ArrayMaxSize(includeFields.length)
  @HasUniqueItems()
  @IsIn(includeFields, { each: true })
  include?: string[] = [];
}
