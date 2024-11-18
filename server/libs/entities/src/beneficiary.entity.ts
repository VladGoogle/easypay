import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './base/model.entity.base';
import { User } from './user.entity';
import { TransactionType } from '@libs/enums/transaction';
import { PaymentAccount } from '@libs/entities/payment-account.entity';
import { Currency } from '@libs/enums/accounts';

@Entity('beneficiaries')
export class Beneficiary extends Model {
  @Column({
    name: 'first_name',
  })
  firstName!: string;

  @Column({
    name: 'last_name',
  })
  lastName!: string;

  @Column({
    name: 'full_name',
    insert: false,
    update: false,
  })
  fullName!: string;

  @Column({
    name: 'phone',
    nullable: true,
  })
  phone?: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId!: string;

  @Column({
    name: 'type',
    type: 'uuid',
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
    name: 'account_id',
    type: 'uuid',
    nullable: true,
  })
  accountId?: string;

  @Column({
    name: 'details',
    type: 'jsonb',
    nullable: true,
  })
  details?: object;

  @ManyToOne(() => User, (d) => d.beneficiaries)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => PaymentAccount, (d) => d.beneficiaries)
  @JoinColumn({ name: 'account_id' })
  account?: PaymentAccount;
}
