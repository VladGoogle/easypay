import { ListDTO } from '@libs/dto';
import {
  HasUniqueItems,
  IsNullableDateRange,
  ValidateIfExists,
} from '@libs/validators';
import { ArrayMaxSize, ArrayMinSize, IsEnum, IsIn } from 'class-validator';
import { SplitToArray } from '@libs/decorators';
import { TransactionStatus } from '@libs/enums/transaction';
import { ApiProperty } from '@nestjs/swagger';

const sortFields = ['createdAt', '-createdAt'] as const;

export class ListTransactionsDTO extends ListDTO {
  @ApiProperty({
    type: String,
    enum: TransactionStatus,
  })
  @ValidateIfExists()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

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
    type: Date,
    required: false,
    nullable: true,
    minLength: 2,
    maxLength: 2,
  })
  @ValidateIfExists()
  @SplitToArray((i) => (i === 'null' || i === '' ? null : i))
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNullableDateRange()
  createdAt?: [Date | null, Date | null];
}
