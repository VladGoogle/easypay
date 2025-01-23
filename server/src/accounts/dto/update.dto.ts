import { IsEnum, IsString, IsUUID } from 'class-validator';

import { AccountStatus } from '@libs/enums/accounts';
import { ValidateIfExists } from '@libs/validators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsUUID()
  countryId?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  iban?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  bic?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  sortCode?: string;

  @ApiProperty({
    enum: AccountStatus,
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsEnum(AccountStatus)
  status?: AccountStatus;
}
