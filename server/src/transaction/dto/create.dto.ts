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
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDTO {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  senderAccountId!: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsUUID()
  receiverAccountId?: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @ValidateIfExists()
  @IsNumber()
  tax?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  total!: number;

  @ApiProperty({
    type: String,
    enum: Currency,
  })
  @IsEnum(Currency)
  currency!: Currency;

  @ApiProperty({
    type: String,
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type!: TransactionType;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  comment?: string;

  @ApiProperty({
    type: TransactionDetailsDTO,
    required: false,
  })
  @ValidateIfExists()
  @ValidateNested()
  @Type(() => TransactionDetailsDTO)
  transactionDetails?: TransactionDetailsDTO;
}
