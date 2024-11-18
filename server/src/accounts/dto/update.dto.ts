import { IsEnum, IsString, IsUUID } from 'class-validator';

import { AccountStatus } from '@libs/enums/accounts';
import { ValidateIfExists } from '@libs/validators';

export class UpdateAccountDTO {
  @ValidateIfExists()
  @IsUUID()
  countryId?: string;

  @ValidateIfExists()
  @IsString()
  iban?: string;

  @ValidateIfExists()
  @IsString()
  bic?: string;

  @ValidateIfExists()
  @IsString()
  sortCode?: string;

  @ValidateIfExists()
  @IsEnum(AccountStatus)
  status?: AccountStatus;
}
