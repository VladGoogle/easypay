import { Column, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Model } from './base/model.entity.base';
import { Card } from './card.entity';
import { Address } from './address.entity';
import { Beneficiary } from './beneficiary.entity';

export class User extends Model {
  @Column({
    type: 'text',
  })
  email!: string;

  @Column({
    type: 'text',
  })
  phone!: string | null;

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
    select: false,
    type: 'text',
  })
  password!: string | undefined;

  @Column({
    name: 'stripe_customer_id',
    type: 'text',
  })
  stripeCustomerId!: string;

  @Column({
    name: 'address_id',
    type: 'uuid',
  })
  addressId!: string;

  @OneToOne(() => Address, (d) => d.user)
  @JoinColumn({ name: 'address_id' })
  address?: Address;

  @OneToMany(() => Card, (d) => d.user, {
    cascade: true,
    eager: false,
    onDelete: 'CASCADE',
  })
  cards?: Card[];

  @OneToMany(() => Beneficiary, (d) => d.user, {
    cascade: true,
    eager: false,
    onDelete: 'CASCADE',
  })
  beneficiaries?: Beneficiary[];
}
