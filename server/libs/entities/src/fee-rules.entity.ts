import { Column, Entity, Index } from 'typeorm';
import { TransactionType } from '@libs/enums/transaction';
import { Model } from '@libs/entities/base/model.entity.base';
import { Currency } from '@libs/enums/accounts';

@Entity('fee_rules')
@Index('IDX_fee_rules_type_currency', ['type', 'currency'], { unique: true })
export class FeeRules extends Model {
  @Column({
    name: 'type',
    type: 'text',
    enum: TransactionType,
  })
  type!: TransactionType;

  @Column({
    name: 'currency',
    type: 'text',
    enum: Currency,
  })
  currency!: Currency;

  @Column({
    name: 'fixed_rate',
    type: 'double precision',
    default: 0.0,
  })
  fixedRate?: number;

  @Column({
    name: 'tax_percent',
    type: 'double precision',
    default: 0.0,
  })
  taxPercent?: number;
}
