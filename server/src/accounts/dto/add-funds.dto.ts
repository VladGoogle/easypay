import { IsNumber } from 'class-validator';

export class AddFundsDTO {
  @IsNumber()
  amount!: number;
}
