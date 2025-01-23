import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDTO {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  @MaxLength(50)
  countryId!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  district!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  city!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstStreetLine!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  secondStreetLine?: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postCode!: string;
}
