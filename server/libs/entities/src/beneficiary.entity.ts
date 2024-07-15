import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './base/model.entity.base';
import { User } from './user.entity';

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
    name: 'card',
  })
  card!: string;

  @ManyToOne(() => User, (d) => d.beneficiaries)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
