import { PrimaryColumn } from 'typeorm';

import { Editable } from './editable.entity.base';
import { ApiProperty } from '@nestjs/swagger';

export abstract class Model extends Editable {
  @ApiProperty({
    type: String,
  })
  @PrimaryColumn({
    type: 'uuid',
  })
  id!: string;
}
