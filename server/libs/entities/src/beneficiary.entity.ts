import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import { Model } from './base/model.entity.base';
import { User } from './user.entity';
import {TransactionType} from "@libs/enums/transaction";

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
    name: 'user_id',
    type: 'uuid',
  })
  userId!: string;

  @Column({
    name: 'type',
    type: 'uuid',
    enum: TransactionType
  })
  type!: TransactionType;

  @Column({
    name: 'details',
    type: 'jsonb'
  })
  details!: object;

  @ManyToOne(() => User, (d) => d.beneficiaries)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
