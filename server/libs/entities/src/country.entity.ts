import { Model } from '@libs/entities/base/model.entity.base';
import { Column, Entity, OneToMany } from 'typeorm';
import { Address } from '@libs/entities/address.entity';

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

  @OneToMany(() => Address, (d) => d.country, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  address?: Address;

  @OneToMany(() => Address, (d) => d.country, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  accounts?: Address;
}
