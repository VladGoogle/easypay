import { ListBaseResponseDTO } from '@libs/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Beneficiary } from '@libs/entities';

export class ListBeneficiariesResponseDTO extends ListBaseResponseDTO {
  @ApiProperty({
    isArray: true,
    type: Beneficiary,
  })
  data: Beneficiary[];
}
