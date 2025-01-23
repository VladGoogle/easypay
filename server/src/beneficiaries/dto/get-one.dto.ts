import { HasUniqueItems } from '@libs/validators';
import { ArrayMaxSize, IsIn, IsOptional } from 'class-validator';
import { SplitToArray } from '@libs/decorators';
import { ApiProperty } from '@nestjs/swagger';

const includeFields = ['user', 'account'] as const;

export class GetOneBeneficiaryDTO {
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
