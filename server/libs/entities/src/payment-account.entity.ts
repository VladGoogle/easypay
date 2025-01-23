import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AccountStatus, Currency } from '@libs/enums/accounts';

import { Model } from './base/model.entity.base';
import { Country } from './country.entity';
import { FundLedger } from './fund-ledger.entity';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';
import { Beneficiary } from '@libs/entities/beneficiary.entity';
import { Invoice } from './invoice.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payment_accounts')
export class PaymentAccount extends Model {
  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'account_number',
    type: 'text',
    unique: true,
  })
  accountNumber!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'iban',
    type: 'text',
    unique: true,
  })
  iban!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'bic',
    type: 'text',
  })
  bic!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'sort_code',
    type: 'text',
  })
  sortCode!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'stripe_payment_method_id',
    type: 'text',
    nullable: true,
  })
  stripePaymentMethodId?: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'stripe_setup_intent_id',
    type: 'text',
    nullable: true,
  })
  stripeSetupIntentId?: string;

  @ApiProperty({
    type: Number,
  })
  @Column({
    name: 'actual_balance',
    nullable: false,
    default: 0.0,
    type: 'double precision',
  })
  actualBalance!: number;

  @ApiProperty({
    type: Number,
  })
  @Column({
    name: 'pending_balance',
    nullable: false,
    default: 0.0,
    type: 'double precision',
  })
  pendingBalance!: number;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'country_id',
    type: 'uuid',
  })
  countryId!: string;

  @ApiProperty({
    enum: Currency,
    type: String,
  })
  @Column({
    name: 'currency',
    type: 'text',
    enum: Currency,
  })
  currency!: Currency;

  @ApiProperty({
    enum: AccountStatus,
    type: String,
  })
  @Column({
    name: 'status',
    type: 'text',
    enum: AccountStatus,
    nullable: false,
    default: AccountStatus.PENDING,
  })
  status?: AccountStatus;

  @ApiProperty({
    type: String,
  })
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
