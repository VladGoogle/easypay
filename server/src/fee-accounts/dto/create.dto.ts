import { IsEnum } from 'class-validator';
import { Currency } from '@libs/enums/accounts';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeeAccountDTO {
  @ApiProperty({
    type: String,
    enum: Currency,
  })
  @IsEnum(Currency)
  currency!: Currency;
}
