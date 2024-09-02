import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import { Model } from './base/model.entity.base';
import {TransactionType} from "@libs/enums/transaction";
import {TransactionStatus} from "@libs/enums/transaction/status.enum";
import {PaymentAccount} from "@libs/entities/payment-account.entity";
import {text} from "express";

@Entity('transactions')
export class Transaction extends Model {

  @Column({
    name: 'number',
    type: 'double precision',
  })
  amount!: number;

  @Column({
    name: 'stripe_charge_id',
    type: 'text',
  })
  stripeChargeId!: string;

  @Column({
    name: 'sender_id',
    type: 'uuid',
  })
  senderId!: string;

  @Column({
    name: 'receiver_id',
    type: 'uuid',
    nullable: true
  })
  receiverId?: string;

  @Column({
    name: 'type',
    type: 'uuid',
    enum: TransactionType
  })
  type!: TransactionType;

  @Column({
    name: 'status',
    type: 'uuid',
    enum: TransactionStatus
  })
  status!: TransactionStatus;

  @Column({
    type: 'text',
  })
  comment!: string;

  @Column({
    name: 'transaction_details',
    type: 'jsonb',
    nullable: true
  })
  transactionDetails?: object;

  @ManyToOne(() => PaymentAccount, (d) => d.sentTransactions)
  @JoinColumn({ name: 'sender_id' })
  sender?: PaymentAccount;

  @ManyToOne(() => PaymentAccount, (d) => d.receivedTransactions)
  @JoinColumn({ name: 'receiver_id' })
  receiver?: PaymentAccount;
}
