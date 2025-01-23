import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFundsDTO {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  amount!: number;
}
