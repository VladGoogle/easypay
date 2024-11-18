import { IsEnum } from 'class-validator';

import { ValidateIfExists } from '@libs/validators';
import { Currency } from '@libs/enums/accounts';

export class UpdateFeeAccountDTO {
  @ValidateIfExists()
  @IsEnum(Currency)
  currency?: Currency;
}
