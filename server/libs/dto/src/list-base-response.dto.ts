import { ListMetaDTO } from './list-meta.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ListBaseResponseDTO {
  @ApiProperty({
    type: ListMetaDTO,
  })
  meta: ListMetaDTO;
}
