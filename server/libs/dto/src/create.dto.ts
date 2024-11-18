import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ValidateIfExists } from '@libs/validators';
import { TransactionType } from '@libs/enums/transaction';
import { TransactionDetailsDTO } from '@libs/dto';

export class CreateBeneficiaryDTO {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ValidateIfExists()
  @IsUUID()
  userId?: string;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @ValidateIfExists()
  @IsUUID()
  accountId?: string;

  @ValidateIfExists()
  @ValidateNested()
  details?: TransactionDetailsDTO;
}
