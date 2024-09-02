import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import { Model } from './base/model.entity.base';
import { User } from './user.entity';
import {Country} from "@libs/entities/country.entity";

@Entity('addresses')
export class Address extends Model {
  @Column({
    name: 'country_id',
    type: 'uuid',
  })
  countryId!: string;

  @Column({
    type: 'text',
  })
  district!: string;

  @Column({
    type: 'text',
  })
  city!: string;

  @Column({
    name: 'first_street_line',
    nullable: true,
    type: 'text',
  })
  firstStreetLine?: string;

  @Column({
    name: 'second_street_line',
    nullable: true,
    type: 'text',
  })
  secondStreetLine?: string;

  @Column({
    name: 'post_code',
    nullable: true,
    type: 'text',
  })
  postCode!: string;

  @OneToOne(() => User, (d) => d.address)
  user?: User;

  @ManyToOne(() => Country, (d) => d.address)
  @JoinColumn({name: 'country_id'})
  country?: Country;
}
