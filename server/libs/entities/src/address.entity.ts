import { Column, OneToOne } from 'typeorm';
import { Model } from './base/model.entity.base';
import { User } from './user.entity';

export class Address extends Model {
  @Column({
    type: 'text',
  })
  country!: string;

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
    name: 'street_line_2',
    nullable: true,
    type: 'text',
  })
  postCode!: string;

  @OneToOne(() => User, (d) => d.address, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  user?: User;
}
