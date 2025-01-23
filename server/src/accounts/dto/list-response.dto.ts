import { ListBaseResponseDTO } from '@libs/dto';
import { PaymentAccount } from '@libs/entities';
import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDTO extends ListBaseResponseDTO {
  @ApiProperty({
    isArray: true,
    type: PaymentAccount,
  })
  data: PaymentAccount[];
}
