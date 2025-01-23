import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class Editable {
  @ApiProperty({
    type: String,
  })
  @CreateDateColumn({
    name: 'created_at',
    default: 'now()',
  })
  createdAt!: Date;

  @ApiProperty({
    type: String,
  })
  @UpdateDateColumn({
    name: 'updated_at',
    default: 'now()',
    onUpdate: 'now()',
  })
  updatedAt!: Date;

  @ApiProperty({
    type: String,
  })
  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt!: Date | null;
}
