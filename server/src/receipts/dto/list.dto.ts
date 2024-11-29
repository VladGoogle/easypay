import { ListDTO } from '@libs/dto';
import {
  HasUniqueItems,
  IsNullableDateRange,
  ValidateIfExists,
} from '@libs/validators';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { SplitToArray } from '@libs/decorators';

const sortFields = ['createdAt', '-createdAt'] as const;

const includeFields = [
  'ledgerTransaction',
  'ledgerTransaction.account',
  'ledgerTransaction.account.user',
] as const;

export class ListReceiptsDTO extends ListDTO {
  @ValidateIfExists()
  @IsString()
  accountId?: string;

  @ValidateIfExists()
  @IsString()
  userid?: string;

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
