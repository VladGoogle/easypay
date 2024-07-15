import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './base/model.entity.base';
import { Card } from './card.entity';

export class Transaction extends Model {
  @Column({
    name: 'number',
    type: 'double',
  })
  amount!: number;

  @Column({
    name: 'stripe_charge_id',
    type: 'text',
  })
  stripeChargeId!: string;

  @Column({
    name: 'sender_card_id',
    type: 'uuid',
  })
  senderCardId!: string;

  @Column({
    name: 'received_card_id',
    type: 'uuid',
  })
  receiverCardId!: string;

  @ManyToOne(() => Card, (d) => d.transactions)
  @JoinColumn({ name: 'sender_card_id' })
  senderCard?: Card;

  @ManyToOne(() => Card, (d) => d.transactions)
  @JoinColumn({ name: 'receiver_card_id' })
  receiverCard?: Card;
}
