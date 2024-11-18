import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { FeeAccount } from '@libs/entities/fee-accounts.entity';
import { Transaction } from '@libs/entities/transaction.entity';
import { FeeTransactionStatus } from '@libs/enums/fee-transaction';

import { Model } from './base/model.entity.base';

@Entity('fee_transactions')
export class FeeTransaction extends Model {
  @Column({
    name: 'amount',
    type: 'double precision',
  })
  amount!: number;

  @Column({
    name: 'transaction_id',
    type: 'uuid',
  })
  transactionId!: string;

  @Column({
    name: 'fee_account_id',
    type: 'uuid',
    nullable: true,
  })
  feeAccountId!: string;

  @Column({
    name: 'status',
    type: 'uuid',
    enum: FeeTransactionStatus,
    nullable: false,
    default: FeeTransactionStatus.PENDING,
  })
  status!: FeeTransactionStatus;

  @ManyToOne(() => FeeAccount, (d) => d.transactions)
  @JoinColumn({ name: 'fee_account_id' })
  account?: FeeAccount;

  @OneToOne(() => Transaction, (d) => d.feeTransaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction?: Transaction;
}
