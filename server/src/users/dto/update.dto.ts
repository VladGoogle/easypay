import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ValidateIfExists } from '@libs/validators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  phone?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  email?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsBoolean()
  isTwoFactorAuthenticationEnabled?: boolean;
}
