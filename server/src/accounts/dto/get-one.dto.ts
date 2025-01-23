import { HasUniqueItems } from '@libs/validators';
import { ArrayMaxSize, IsIn, IsOptional } from 'class-validator';
import { SplitToArray } from '@libs/decorators';
import { ApiProperty } from '@nestjs/swagger';

const includeFields = ['ledgerTransactions', 'invoices'] as const;

export class GetOneAccountDTO {
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
