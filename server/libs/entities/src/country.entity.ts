import { Model } from '@libs/entities/base/model.entity.base';
import { Column, Entity, OneToMany } from 'typeorm';
import { Address } from '@libs/entities/address.entity';
import { PaymentAccount } from '@libs/entities/payment-account.entity';

@Entity('countries')
export class Country extends Model {
  @Column({
    name: 'name',
    type: 'text',
  })
  name!: string;

  @Column({
    name: 'iso2_code',
    type: 'text',
  })
  iso2Code!: string;

  @Column({
    name: 'iso3_code',
    type: 'text',
  })
  iso3Code!: string;

  @OneToMany(() => Address, (ad) => ad.country, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  address?: Address;

  @OneToMany(() => PaymentAccount, (ac) => ac.country, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  accounts?: PaymentAccount;
}
