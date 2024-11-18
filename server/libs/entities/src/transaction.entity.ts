import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Model } from './base/model.entity.base';
import { DirectionType, TransactionType } from '@libs/enums/transaction';
import { TransactionStatus } from '@libs/enums/transaction/status.enum';
import { PaymentAccount } from '@libs/entities/payment-account.entity';
import { FeeTransaction } from '@libs/entities/fee-transactions.entity';
import { FundLedger } from '@libs/entities/fund-ledger.entity';
import { SumsubTransactionStatus } from '@libs/enums/sumsub';
import { Currency } from '@libs/enums/accounts';

@Entity('transactions')
export class Transaction extends Model {
  @Column({
    name: 'amount',
    type: 'double precision',
  })
  amount!: number;

  @Column({
    name: 'tax',
    type: 'double precision',
    nullable: true,
  })
  tax?: number;

  @Column({
    name: 'total',
    type: 'double precision',
  })
  total!: number;

  @Column({
    name: 'stripe_payment_intent_id',
    type: 'text',
    nullable: true,
  })
  stripePaymentIntentId?: string;

  @Column({
    name: 'sender_account_id',
    type: 'uuid',
  })
  senderAccountId!: string;

  @Column({
    name: 'receiver_account_id',
    type: 'uuid',
    nullable: true,
  })
  receiverAccountId?: string;

  @Column({
    name: 'type',
    type: 'text',
    enum: TransactionType,
  })
  type!: TransactionType;

  @Column({
    name: 'currency',
    type: 'text',
    enum: Currency,
  })
  currency!: Currency;

  @Column({
    name: 'sumsub_status',
    type: 'text',
    enum: SumsubTransactionStatus,
    default: SumsubTransactionStatus.REVIEWED,
  })
  sumsubStatus!: SumsubTransactionStatus;

  @Column({
    name: 'status',
    type: 'text',
    enum: TransactionStatus,
    default: TransactionStatus.SUMSUB_PENDING,
  })
  status!: TransactionStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment?: string;

  @Column({
    name: 'transaction_details',
    type: 'jsonb',
    nullable: true,
  })
  transactionDetails?: object;

  @ManyToOne(() => PaymentAccount, (d) => d.sentTransactions)
  @JoinColumn({ name: 'sender_account_id' })
  senderAccount?: PaymentAccount;

  @ManyToOne(() => PaymentAccount, (d) => d.receivedTransactions)
  @JoinColumn({ name: 'receiver_account_id' })
  receiverAccount?: PaymentAccount;

  @OneToOne(() => FeeTransaction, (d) => d.transaction, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  feeTransaction?: FeeTransaction[];

  @OneToMany(() => FundLedger, (d) => d.transaction, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  ledgerRecord?: FundLedger[];
}
