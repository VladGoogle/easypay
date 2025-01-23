import { Column, Entity, OneToMany } from 'typeorm';
import { Model } from './base/model.entity.base';
import { FeeTransaction } from '@libs/entities/fee-transactions.entity';
import { Currency } from '@libs/enums/accounts';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fee_accounts')
export class FeeAccount extends Model {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @Column({
    name: 'pending_balance',
    nullable: false,
    default: 0.0,
    type: 'double precision',
  })
  pendingBalance?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @Column({
    name: 'actual_balance',
    nullable: false,
    default: 0.0,
    type: 'double precision',
  })
  actualBalance?: number;

  @ApiProperty({
    type: String,
    enum: Currency,
  })
  @Column({
    unique: true,
    name: 'currency',
    type: 'text',
    enum: Currency,
  })
  currency!: Currency;

  @OneToMany(() => FeeTransaction, (d) => d.account, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  transactions?: FeeTransaction[];
}
