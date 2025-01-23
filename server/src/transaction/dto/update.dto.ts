import { IsEnum } from 'class-validator';
import { TransactionStatus } from '@libs/enums/transaction';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDTO {
  @ApiProperty({
    type: String,
    enum: TransactionStatus,
    required: true,
  })
  @IsEnum(TransactionStatus)
  status!: TransactionStatus;
}
