import { HasUniqueItems } from '@libs/validators';
import { ArrayMaxSize, IsIn, IsOptional } from 'class-validator';
import { SplitToArray } from '@libs/decorators';

const includeFields = ['user', 'account'] as const;

export class GetOneBeneficiaryDTO {
  @IsOptional()
  @SplitToArray()
  @ArrayMaxSize(includeFields.length)
  @HasUniqueItems()
  @IsIn(includeFields, { each: true })
  include?: string[] = [];
}
