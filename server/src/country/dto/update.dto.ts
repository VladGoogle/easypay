import { IsNotEmpty, IsString } from 'class-validator';

import { ValidateIfExists } from '@libs/validators';

export class UpdateCountryDTO {
  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  iso2Code?: string;

  @ValidateIfExists()
  @IsString()
  @IsNotEmpty()
  iso3Code?: string;
}
