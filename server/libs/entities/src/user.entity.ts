import {Column, Entity, JoinColumn, OneToMany, OneToOne} from 'typeorm';
import { Model } from './base/model.entity.base';
import {PaymentAccount} from './payment-account.entity';
import { Address } from './address.entity';
import { Beneficiary } from './beneficiary.entity';
import {ApplicantStatus} from "@libs/enums/sumsub";

@Entity('users')
export class User extends Model {
  @Column({
    type: 'text',
    unique: true
  })
  email!: string;

  @Column({
    type: 'text',
    unique: true
  })
  phone!: string;

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
  fullName?: string;

  @Column({
    select: false,
    type: 'text',
  })
  password!: string;

  @Column({
    name: 'applicant_status',
    type: 'text',
    enum: ApplicantStatus,
    nullable: true
  })
  applicantStatus?: ApplicantStatus;

  // @Column({
  //   name: 'applicant_id',
  //   type: 'text',
  //   nullable: true
  // })
  // applicantId?: string;
  //
  // @Column({
  //   name: 'inspection_id',
  //   type: 'text',
  //   nullable: true
  // })
  // inspectionId?: string;

  @Column({
    name: 'rejection_reason',
    type: 'text',
    nullable: true
  })
  rejectionReason?: string;

  @Column({
    name: 'stripe_customer_id',
    type: 'text',
    nullable: true
  })
  stripeCustomerId?: string;

  @Column({
    name: 'address_id',
    type: 'uuid',
  })
  addressId!: string;

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
