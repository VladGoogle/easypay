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
} from 'class-validator';
import { SplitToArray } from '@libs/decorators';
import { TransactionStatus } from '@libs/enums/transaction';

const sortFields = ['createdAt', '-createdAt'] as const;

export class ListTransactionsDTO extends ListDTO {
  @ValidateIfExists()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

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
