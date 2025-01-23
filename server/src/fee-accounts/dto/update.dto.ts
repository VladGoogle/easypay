import { IsEnum } from 'class-validator';

import { ValidateIfExists } from '@libs/validators';
import { Currency } from '@libs/enums/accounts';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeeAccountDTO {
  @ApiProperty({
    type: String,
    enum: Currency,
    required: false,
  })
  @ValidateIfExists()
  @IsEnum(Currency)
  currency?: Currency;
}
