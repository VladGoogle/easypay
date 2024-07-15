import { Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Model } from './base/model.entity.base';
import { Currency } from '@libs/enums/card';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

export class Card extends Model {
  @Column({
    name: 'number',
    type: 'text',
  })
  number!: string;

  @Column({
    name: 'expire_month',
    type: 'number',
  })
  expireMonth!: number;

  @Column({
    name: 'expire_year',
    type: 'number',
  })
  expireYear!: number;

  @Column({
    name: 'cvc',
    type: 'number',
  })
  cvc!: number;

  @Column({
    name: 'stripe_card_id',
    type: 'text',
  })
  stripeCardId!: string;

  @Column({
    name: 'balance',
    nullable: false,
    default: 0.0,
    type: 'double',
  })
  balance!: number;

  @Column({
    name: 'item_id',
    type: 'uuid',
  })
  userId!: string;

  @Column({
    name: 'currency',
    type: 'text',
    enum: Currency,
  })
  currency!: Currency;

  @ManyToOne(() => User, (d) => d.cards)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => Transaction, (d) => d.senderCard, {
    cascade: true,
    eager: false,
    onDelete: 'SET NULL',
  })
  transactions!: Transaction[];
}
