import { Column, Entity, OneToMany } from 'typeorm';
import { Model } from './base/model.entity.base';
import { FeeTransaction } from '@libs/entities/fee-transactions.entity';
import { Currency } from '@libs/enums/accounts';

@Entity('fee_accounts')
export class FeeAccount extends Model {
  @Column({
    name: 'pending_balance',
    nullable: false,
    default: 0.0,
    type: 'double precision',
  })
  pendingBalance?: number;

  @Column({
    name: 'actual_balance',
    nullable: false,
    default: 0.0,
    type: 'double precision',
  })
  actualBalance?: number;

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
