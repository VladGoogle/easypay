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
  @IsString()
  accountId!: string;

  @ValidateIfExists()
  @SplitToArray()
  @ArrayMaxSize(Object.keys(TransactionStatus).length)
  @HasUniqueItems()
  @IsEnum(TransactionStatus, { each: true })
  statuses?: TransactionStatus[];

  @ValidateIfExists()
  @SplitToArray()
  @ArrayMaxSize(sortFields.length)
  @HasUniqueItems()
  @IsIn(sortFields, { each: true })
  sort = ['-createdAt'];

  @ValidateIfExists()
  @SplitToArray((i) => (i === 'null' || i === '' ? null : i))
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNullableDateRange()
  createdAt?: [Date | null, Date | null];

  @IsOptional()
  @SplitToArray()
  @ArrayMaxSize(includeFields.length)
  @HasUniqueItems()
  @IsIn(includeFields, { each: true })
  include?: string[] = [];
}
