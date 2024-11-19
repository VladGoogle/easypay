import {
  ArrayMaxSize,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { SplitToArray } from '@libs/decorators';
import { ListDTO } from '@libs/dto';
import { HasUniqueItems, ValidateIfExists } from '@libs/validators';
import { AccountStatus, Currency } from '@libs/enums/accounts';

const includeFields = ['account', 'user', 'account.user'] as const;

export class ListBeneficiariesDTO extends ListDTO {
  @ValidateIfExists()
  @IsString()
  fullName?: string;

  @ValidateIfExists()
  @IsString()
  phone?: string;

  @IsOptional()
  @SplitToArray()
  @ArrayMaxSize(includeFields.length)
  @HasUniqueItems()
  @IsIn(includeFields, { each: true })
  include?: string[] = [];
}
