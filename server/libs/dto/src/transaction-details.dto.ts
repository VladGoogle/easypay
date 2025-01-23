import { IsString, IsUUID } from 'class-validator';
import { ValidateIfExists } from '@libs/validators';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDetailsDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  lastName!: string;

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
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  phone?: string;
}
