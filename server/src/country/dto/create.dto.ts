import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  iso2Code!: string;

  @IsString()
  @IsNotEmpty()
  iso3Code!: string;
}
