import {
  ArrayMaxSize,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

import { SplitToArray } from '@libs/decorators';
import { ListDTO } from '@libs/dto';
import { HasUniqueItems, ValidateIfExists } from '@libs/validators';
import { ApiProperty } from '@nestjs/swagger';

const includeFields = ['account', 'user', 'account.user'] as const;

export class ListBeneficiariesDTO extends ListDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  fullName?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  phone?: string;

  @ApiProperty({
    isArray: true,
    type: String,
    required: false,
    uniqueItems: true,
  })
  @IsOptional()
  @SplitToArray()
  @ArrayMaxSize(includeFields.length)
  @HasUniqueItems()
  @IsIn(includeFields, { each: true })
  include?: string[] = [];
}
