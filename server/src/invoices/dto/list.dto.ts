import { ListDTO } from '@libs/dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  HasUniqueItems,
  IsNullableDateRange,
  ValidateIfExists,
} from '@libs/validators';
import { SplitToArray } from '@libs/decorators';
import { ApiProperty } from '@nestjs/swagger';

const sortFields = ['createdAt', '-createdAt'] as const;

const includeFields = ['account'] as const;

export class ListInvoicesDTO extends ListDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  @ValidateIfExists()
  @IsString()
  accountId?: string;

  @ApiProperty({
    isArray: true,
    type: String,
    required: false,
    uniqueItems: true,
  })
  @ValidateIfExists()
  @SplitToArray()
  @ArrayMaxSize(sortFields.length)
  @HasUniqueItems()
  @IsIn(sortFields, { each: true })
  sort = ['-createdAt'];

  @ApiProperty({
    isArray: true,
    type: String,
    required: false,
    uniqueItems: true,
    minLength: 2,
    maxLength: 2,
  })
  @ValidateIfExists()
  @SplitToArray((i) => (i === 'null' || i === '' ? null : i))
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNullableDateRange()
  createdAt?: [Date | null, Date | null];

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
