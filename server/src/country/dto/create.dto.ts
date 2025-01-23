import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  iso2Code!: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  iso3Code!: string;
}
