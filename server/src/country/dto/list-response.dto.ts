import { ListBaseResponseDTO } from '@libs/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Country } from '@libs/entities';

export class ListCountriesResponseDTO extends ListBaseResponseDTO {
  @ApiProperty({
    isArray: true,
    type: Country,
  })
  data: Country[];
}
