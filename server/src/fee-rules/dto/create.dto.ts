import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { TransactionType } from '@libs/enums/transaction';
import { ValidateIfExists } from '@libs/validators';
import { Currency } from '@libs/enums/accounts';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeeRuleDTO {
  @ApiProperty({
    type: String,
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type!: TransactionType;

  @ApiProperty({
    type: String,
    enum: Currency,
  })
  @IsEnum(Currency)
  @IsNotEmpty()
  currency!: Currency;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @ValidateIfExists()
  @IsOptional()
  @IsNumber()
  fixedRate?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @ValidateIfExists()
  @IsOptional()
  @IsNumber()
  taxPercent?: number;
}
