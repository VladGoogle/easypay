import { IsEnum } from 'class-validator';
import { Currency } from '@libs/enums/accounts';

export class CreateFeeAccountDTO {
  @IsEnum(Currency)
  currency!: Currency;
}
