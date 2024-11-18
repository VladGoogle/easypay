import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './base/model.entity.base';
import { DirectionType } from '@libs/enums/transaction';
import { PaymentAccount } from '@libs/entities/payment-account.entity';
import { Transaction } from '@libs/entities/transaction.entity';

@Entity('fund_ledger')
export class FundLedger extends Model {
  @Column({
    name: 'transaction_id',
    type: 'uuid',
  })
  transactionId!: string;

  @Column({
    name: 'account_id',
    type: 'uuid',
  })
  accountId!: string;

  @Column({
    name: 'net_amount',
    type: 'double precision',
  })
  net_amount!: number;

  @Column({
    name: 'pit_balance_before',
    type: 'double precision',
  })
  pitBalanceBefore!: number;

  @Column({
    name: 'pit_balance_after',
    type: 'double precision',
  })
  pitBalanceAfter!: number;

  @Column({
    name: 'direction_type',
    type: 'text',
  })
  directionType!: DirectionType;

  @ManyToOne(() => Transaction, (d) => d.ledgerRecord)
  @JoinColumn({ name: 'transaction_id' })
  transaction?: Transaction;

  @ManyToOne(() => PaymentAccount, (d) => d.ledgerTransactions)
  @JoinColumn({ name: 'account_id' })
  account?: PaymentAccount;
}
