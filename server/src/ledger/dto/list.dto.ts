import { ListDTO } from '@libs/dto';
import {
  HasUniqueItems,
  IsNullableDateRange,
  ValidateIfExists,
} from '@libs/validators';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { SplitToArray } from '@libs/decorators';
import { TransactionStatus } from '@libs/enums/transaction';
import { ApiProperty } from '@nestjs/swagger';

const sortFields = [
  'createdAt',
  '-createdAt',
  'directionType',
  '-directionType',
  'netAmount',
  '-netAmount',
  'transaction.currency',
  '-transaction.currency',
  'transaction.status',
  '-transaction.status',
] as const;

const includeFields = ['transaction', 'account'] as const;

export class ListLedgerTransactionsDTO extends ListDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  accountId!: string;

  @ApiProperty({
    isArray: true,
    type: String,
    required: false,
    uniqueItems: true,
  })
  @ValidateIfExists()
  @SplitToArray()
  @ArrayMaxSize(Object.keys(TransactionStatus).length)
  @HasUniqueItems()
  @IsEnum(TransactionStatus, { each: true })
  statuses?: TransactionStatus[];

  @ApiProperty({
    isArray: true,
    type: String,
    required: false,
    uniqueItems: true,
  })
  @ValidateIfExists()
  @SplitToArray()
  @ArrayMaxSize(sortFields.length)
  @HasUniqueItems()
  @IsIn(sortFields, { each: true })
  sort = ['-createdAt'];

  @ApiProperty({
    isArray: true,
    type: String,
    required: false,
    uniqueItems: true,
    minLength: 2,
    maxLength: 2,
  })
  @ValidateIfExists()
  @SplitToArray((i) => (i === 'null' || i === '' ? null : i))
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNullableDateRange()
  createdAt?: [Date | null, Date | null];

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
