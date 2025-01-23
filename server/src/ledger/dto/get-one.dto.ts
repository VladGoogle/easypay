import { ArrayMaxSize, IsIn, IsOptional } from 'class-validator';

import { SplitToArray } from '@libs/decorators';
import { HasUniqueItems } from '@libs/validators';
import { ApiProperty } from '@nestjs/swagger';

const includeFields = [
  'transaction',
  'transaction.senderAccount',
  'transaction.receiverAccount',
] as const;

export class GetOneLedgerTransactionsDTO {
  @ApiProperty({
    isArray: true,
    type: String,
    required: false,
    uniqueItems: true,
  })
  @IsOptional()
  @SplitToArray()
  @ArrayMaxSize(includeFields.length)
  @HasUniqueItems()
  @IsIn(includeFields, { each: true })
  include?: string[] = [];
}
