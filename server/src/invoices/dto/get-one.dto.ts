import { ArrayMaxSize, IsIn, IsOptional } from 'class-validator';

import { SplitToArray } from '@libs/decorators';
import { HasUniqueItems } from '@libs/validators';

const includeFields = ['account'] as const;

export class GetOneInvoiceDTO {
  @IsOptional()
  @SplitToArray()
  @ArrayMaxSize(includeFields.length)
  @HasUniqueItems()
  @IsIn(includeFields, { each: true })
  include?: string[] = [];
}
