import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { ValidateIfExists } from '@libs/validators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDTO {
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
  email?: string;
}
