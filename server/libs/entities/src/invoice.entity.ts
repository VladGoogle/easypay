import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from '@libs/entities/base/model.entity.base';
import { PaymentAccount } from '@libs/entities/payment-account.entity';

@Entity('invoices')
export class Invoice extends Model {
  @Column({
    name: 'account_id',
    type: 'uuid',
  })
  accountId!: string;

  @Column({
    name: 'key',
    type: 'text',
    unique: true,
  })
  key!: string;

  @ManyToOne(() => PaymentAccount, (d) => d.invoices)
  @JoinColumn({ name: 'account_id' })
  account?: PaymentAccount;
}
