import { IsString, IsUUID } from 'class-validator';
import { ValidateIfExists } from '@libs/validators';

export class TransactionDetailsDTO {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

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
  @IsString()
  phone?: string;
}
