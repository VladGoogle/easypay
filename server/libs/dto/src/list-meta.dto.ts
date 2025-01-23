import { ApiProperty } from '@nestjs/swagger';

export class ListMetaDTO {
  @ApiProperty({ type: Number })
  offset: number;

  @ApiProperty({ type: Number })
  limit: number;

  @ApiProperty({ type: Number })
  total: number;
}
