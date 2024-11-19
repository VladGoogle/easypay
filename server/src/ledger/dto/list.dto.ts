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
  IsUUID,
} from 'class-validator';
import { AccountStatus, Currency } from '@libs/enums/accounts';
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

export class ListLedgerTransactionsDTO extends ListDTO {
  @IsString()
  accountId?: string;

  @ValidateIfExists()
  @SplitToArray()
  @ArrayMaxSize(Object.keys(Currency).length)
  @HasUniqueItems()
  @IsEnum(Currency, { each: true })
  currencies?: Currency[];

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
}
