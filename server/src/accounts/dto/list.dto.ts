import {
  ArrayMaxSize,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { SplitToArray } from '@libs/decorators';
import { ListDTO } from '@libs/dto';
import { HasUniqueItems, ValidateIfExists } from '@libs/validators';
import { AccountStatus, Currency } from '@libs/enums/accounts';
import { ApiProperty } from '@nestjs/swagger';

const includeFields = ['country', 'user'] as const;

export class ListAccountsDTO extends ListDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  phone?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  accountNumber?: string;

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
  iban?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  sortCode?: string;

  @ApiProperty({
    enum: Currency,
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiProperty({
    enum: AccountStatus,
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

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
