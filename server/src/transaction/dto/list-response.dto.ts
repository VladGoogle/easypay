import { ListBaseResponseDTO } from '@libs/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '@libs/entities';

export class ListTransactionsResponseDTO extends ListBaseResponseDTO {
  @ApiProperty({
    isArray: true,
    type: Transaction,
  })
  data: Transaction[];
}
