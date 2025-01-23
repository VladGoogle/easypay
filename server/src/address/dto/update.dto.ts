import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { ValidateIfExists } from '@libs/validators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsUUID()
  @IsNotEmpty()
  @MaxLength(50)
  countryId?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  district?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  city?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  firstStreetLine?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  secondStreetLine?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postCode?: string;
}
