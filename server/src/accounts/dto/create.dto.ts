import { IsEnum, IsString, IsUUID } from 'class-validator';

import { Currency } from '@libs/enums/accounts';

export class CreateAccountDTO {
  @IsUUID()
  countryId!: string;

  @IsString()
  iban!: string;

  @IsString()
  accountNumber!: string;

  @IsString()
  bic!: string;

  @IsString()
  sortCode!: string;

  @IsEnum(Currency)
  currency!: Currency;
}
