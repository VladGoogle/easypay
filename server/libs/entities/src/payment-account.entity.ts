import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AccountStatus, Currency } from '@libs/enums/accounts';

import { Model } from './base/model.entity.base';
import { Country } from './country.entity';
import { FundLedger } from './fund-ledger.entity';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';
import { Beneficiary } from '@libs/entities/beneficiary.entity';
import { Invoice } from './invoice.entity';

@Entity('payment_accounts')
export class PaymentAccount extends Model {
  @Column({
    name: 'account_number',
    type: 'text',
    unique: true,
  })
  accountNumber!: string;

  @Column({
    name: 'iban',
    type: 'text',
    unique: true,
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
    nullable: true,
  })
  stripePaymentMethodId?: string;

  @Column({
    name: 'stripe_setup_intent_id',
    type: 'text',
    nullable: true,
  })
  stripeSetupIntentId?: string;

  @Column({
    name: 'actual_balance',
    nullable: false,
    default: 0.0,
    type: 'double precision',
  })
  actualBalance!: number;

  @Column({
    name: 'pending_balance',
    nullable: false,
    default: 0.0,
    type: 'double precision',
  })
  pendingBalance!: number;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId!: string;

  @Column({
    name: 'country_id',
    type: 'uuid',
  })
  countryId!: string;

  @Column({
    name: 'currency',
    type: 'text',
    enum: Currency,
  })
  currency!: Currency;

  @Column({
    name: 'status',
    type: 'text',
    enum: AccountStatus,
    nullable: false,
    default: AccountStatus.PENDING,
  })
  status?: AccountStatus;

  @Column({
    name: 'resubmission_reason',
    type: 'text',
    nullable: true,
  })
  resubmissionReason?: string;

  @ManyToOne(() => Country, (d) => d.accounts)
  @JoinColumn({ name: 'country_id' })
  country?: Country;

  @ManyToOne(() => User, (d) => d.accounts)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => Transaction, (d) => d.senderAccount, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  sentTransactions!: Transaction[];

  @OneToMany(() => Transaction, (d) => d.receiverAccount, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  receivedTransactions!: Transaction[];

  @OneToMany(() => FundLedger, (d) => d.account, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  ledgerTransactions!: FundLedger[];

  @OneToMany(() => Beneficiary, (d) => d.account, {
    cascade: true,
    eager: false,
    onDelete: 'CASCADE',
  })
  beneficiaries!: Beneficiary[];

  @OneToMany(() => Invoice, (d) => d.account, {
    cascade: true,
    eager: false,
    onDelete: 'CASCADE',
  })
  invoices!: Invoice[];
}
