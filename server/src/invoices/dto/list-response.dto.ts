import { ListBaseResponseDTO } from '@libs/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Invoice } from '@libs/entities';

export class ListInvoicesResponseDTO extends ListBaseResponseDTO {
  @ApiProperty({
    isArray: true,
    type: Invoice,
  })
  data: Invoice[];
}
