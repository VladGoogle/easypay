import { ListBaseResponseDTO } from '@libs/dto';
import { ApiProperty } from '@nestjs/swagger';
import { FundLedger } from '@libs/entities';

export class ListLedgersResponseDTO extends ListBaseResponseDTO {
  @ApiProperty({
    isArray: true,
    type: FundLedger,
  })
  data: FundLedger[];
}
