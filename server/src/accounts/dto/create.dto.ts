import { IsEnum, IsString, IsUUID } from 'class-validator';

import { Currency } from '@libs/enums/accounts';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDTO {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  countryId!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  iban!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  accountNumber!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  bic!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  sortCode!: string;

  @ApiProperty({
    enum: Currency,
    type: String,
    required: true,
  })
  @IsEnum(Currency)
  currency!: Currency;
}
