import { ListDTO } from '@libs/dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  HasUniqueItems,
  IsNullableDateRange,
  ValidateIfExists,
} from '@libs/validators';
import { SplitToArray } from '@libs/decorators';

const sortFields = ['createdAt', '-createdAt'] as const;

const includeFields = ['account'] as const;

export class ListInvoicesDTO extends ListDTO {
  @ValidateIfExists()
  @IsString()
  accountId?: string;

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
