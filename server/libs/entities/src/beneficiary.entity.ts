import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './base/model.entity.base';
import { User } from './user.entity';
import { TransactionType } from '@libs/enums/transaction';
import { PaymentAccount } from '@libs/entities/payment-account.entity';
import { Currency } from '@libs/enums/accounts';
import { ApiProperty } from '@nestjs/swagger';

@Entity('beneficiaries')
export class Beneficiary extends Model {
  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'first_name',
  })
  firstName!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'last_name',
  })
  lastName!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'full_name',
    insert: false,
    update: false,
  })
  fullName!: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Column({
    name: 'phone',
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId!: string;

  @ApiProperty({
    enum: TransactionType,
    type: String,
  })
  @Column({
    type: 'text',
    enum: TransactionType,
  })
  type!: TransactionType;

  @ApiProperty({
    enum: Currency,
    type: String,
  })
  @Column({
    type: 'text',
    enum: Currency,
  })
  currency!: Currency;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Column({
    name: 'account_id',
    type: 'uuid',
    nullable: true,
  })
  accountId?: string;

  @ApiProperty({
    type: Object,
    required: false,
  })
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
