import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { TransactionType } from '@libs/enums/transaction';
import { ValidateIfExists } from '@libs/validators';
import { Currency } from '@libs/enums/accounts';
import { TransactionDetailsDTO } from '@libs/dto';
import { Type } from 'class-transformer';

export class CreateTransactionDTO {
  @IsUUID()
  @IsNotEmpty()
  senderAccountId!: string;

  @ValidateIfExists()
  @IsUUID()
  receiverAccountId?: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ValidateIfExists()
  @IsNumber()
  tax?: number;

  @IsNumber()
  @IsNotEmpty()
  total!: number;

  @IsEnum(Currency)
  currency!: Currency;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type!: TransactionType;

  @ValidateIfExists()
  @IsString()
  comment?: string;

  @ValidateIfExists()
  @ValidateNested()
  @Type(() => TransactionDetailsDTO)
  transactionDetails?: TransactionDetailsDTO;
}
