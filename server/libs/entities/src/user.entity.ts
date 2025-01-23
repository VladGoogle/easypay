import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Model } from './base/model.entity.base';
import { PaymentAccount } from './payment-account.entity';
import { Address } from './address.entity';
import { Beneficiary } from './beneficiary.entity';
import { ApplicantStatus } from '@libs/enums/sumsub';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends Model {
  @ApiProperty({
    type: String,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  email!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  phone!: string;

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
  })
  @Column({
    select: false,
    type: 'text',
  })
  password!: string;

  @ApiProperty({
    type: String,
    enum: ApplicantStatus,
    required: false,
  })
  @Column({
    name: 'applicant_status',
    type: 'text',
    enum: ApplicantStatus,
    nullable: true,
  })
  applicantStatus?: ApplicantStatus;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Column({
    name: 'applicant_id',
    type: 'text',
    nullable: true,
  })
  applicantId?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Column({
    name: 'rejection_reason',
    type: 'text',
    nullable: true,
  })
  rejectionReason?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Column({
    name: 'stripe_customer_id',
    type: 'text',
    unique: true,
    nullable: true,
  })
  stripeCustomerId?: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'address_id',
    type: 'uuid',
  })
  addressId!: string;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @Column({
    name: 'is_two_factor_auth_enabled',
    default: false,
  })
  isTwoFactorAuthenticationEnabled?: boolean;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Column({
    name: 'two_factor_auth_secret',
    nullable: true,
  })
  twoFactorAuthenticationSecret?: string;

  @ApiProperty({
    type: String,
    required: false,
    isArray: true,
  })
  @Column({
    name: 'fcm_tokens',
    type: 'text',
    array: true,
    nullable: true,
  })
  fcmTokens?: string[];

  @OneToOne(() => Address, (d) => d.user, {
    cascade: true,
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'address_id' })
  address?: Address;

  @OneToMany(() => PaymentAccount, (d) => d.user, {
    cascade: true,
    eager: false,
    onDelete: 'CASCADE',
  })
  accounts?: PaymentAccount[];

  @OneToMany(() => Beneficiary, (d) => d.user, {
    cascade: true,
    eager: false,
    onDelete: 'CASCADE',
  })
  beneficiaries?: Beneficiary[];
}
