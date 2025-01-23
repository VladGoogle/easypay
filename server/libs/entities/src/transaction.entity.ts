import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Model } from './base/model.entity.base';
import { TransactionType } from '@libs/enums/transaction';
import { TransactionStatus } from '@libs/enums/transaction/status.enum';
import { PaymentAccount } from '@libs/entities/payment-account.entity';
import { FeeTransaction } from '@libs/entities/fee-transactions.entity';
import { FundLedger } from '@libs/entities/fund-ledger.entity';
import { SumsubTransactionStatus } from '@libs/enums/sumsub';
import { Currency } from '@libs/enums/accounts';
import { ApiProperty } from '@nestjs/swagger';

@Entity('transactions')
export class Transaction extends Model {
  @ApiProperty({
    type: Number,
  })
  @Column({
    name: 'amount',
    type: 'double precision',
  })
  amount!: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @Column({
    name: 'tax',
    type: 'double precision',
    nullable: true,
  })
  tax?: number;

  @ApiProperty({
    type: Number,
  })
  @Column({
    name: 'total',
    type: 'double precision',
  })
  total!: number;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'stripe_payment_intent_id',
    type: 'text',
    nullable: true,
  })
  stripePaymentIntentId?: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'sender_account_id',
    type: 'uuid',
  })
  senderAccountId!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'receiver_account_id',
    type: 'uuid',
    nullable: true,
  })
  receiverAccountId?: string;

  @ApiProperty({
    type: String,
    enum: TransactionType,
  })
  @Column({
    name: 'type',
    type: 'text',
    enum: TransactionType,
  })
  type!: TransactionType;

  @ApiProperty({
    type: String,
    enum: Currency,
  })
  @Column({
    name: 'currency',
    type: 'text',
    enum: Currency,
  })
  currency!: Currency;

  @ApiProperty({
    type: String,
    enum: SumsubTransactionStatus,
  })
  @Column({
    name: 'sumsub_status',
    type: 'text',
    enum: SumsubTransactionStatus,
    default: SumsubTransactionStatus.REVIEWED,
  })
  sumsubStatus!: SumsubTransactionStatus;

  @ApiProperty({
    type: String,
    enum: TransactionStatus,
  })
  @Column({
    name: 'status',
    type: 'text',
    enum: TransactionStatus,
    default: TransactionStatus.SUMSUB_PENDING,
  })
  status!: TransactionStatus;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  comment?: string;

  @ApiProperty({
    type: Object,
    required: false,
  })
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
