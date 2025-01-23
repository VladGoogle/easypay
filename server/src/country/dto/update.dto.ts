import { IsNotEmpty, IsString } from 'class-validator';

import { ValidateIfExists } from '@libs/validators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCountryDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  iso2Code?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  iso3Code?: string;
}
