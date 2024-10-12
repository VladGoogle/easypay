import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import { Model } from './base/model.entity.base';
import { Currency } from '@libs/enums/card';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity('payment_accounts')
export class PaymentAccount extends Model {

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: false
  })
  isActive?: boolean;

  @Column({
    name: 'account_number',
    type: 'text',
  })
  accountNumber!: string;

  @Column({
    name: 'iban',
    type: 'text',
  })
  iban!: string;

  @Column({
    name: 'bic',
    type: 'text',
  })
  bic!: string;

  @Column({
    name: 'sort_code',
    type: 'text',
  })
  sortCode!: string;

  @Column({
    name: 'stripe_payment_method_id',
    type: 'text',
    nullable: true
  })
  stripePaymentMethodId?: string;

  @Column({
    name: 'balance',
    nullable: false,
    default: 0.00,
    type: 'double precision',
  })
  balance!: number;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId!: string;

  @Column({
    name: 'currency',
    type: 'text',
    enum: Currency,
  })
  currency!: Currency;

  @ManyToOne(() => User, (d) => d.accounts)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => Transaction, (d) => d.sender, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  sentTransactions!: Transaction[];

  @OneToMany(() => Transaction, (d) => d.receiver, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  receivedTransactions!: Transaction[];
}
