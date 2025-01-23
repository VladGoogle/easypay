import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Model } from './base/model.entity.base';
import { DirectionType } from '@libs/enums/transaction';
import { PaymentAccount, Transaction } from '@libs/entities';
import { Receipt } from '@libs/entities/receipt.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fund_ledger')
export class FundLedger extends Model {
  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'transaction_id',
    type: 'uuid',
  })
  transactionId!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'account_id',
    type: 'uuid',
  })
  accountId!: string;

  @ApiProperty({
    type: Number,
  })
  @Column({
    name: 'net_amount',
    type: 'double precision',
  })
  netAmount!: number;

  @ApiProperty({
    type: Number,
  })
  @Column({
    name: 'pit_balance_before',
    type: 'double precision',
  })
  pitBalanceBefore!: number;

  @ApiProperty({
    type: Number,
  })
  @Column({
    name: 'pit_balance_after',
    type: 'double precision',
  })
  pitBalanceAfter!: number;

  @ApiProperty({
    type: String,
    enum: DirectionType,
  })
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

  @OneToOne(() => Receipt, (d) => d.ledgerTransaction, {
    cascade: true,
    eager: false,
    onDelete: 'CASCADE',
  })
  receipt?: Receipt[];
}
