import { Column, Entity, Index } from 'typeorm';
import { TransactionType } from '@libs/enums/transaction';
import { Model } from '@libs/entities/base/model.entity.base';
import { Currency } from '@libs/enums/accounts';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fee_rules')
@Index('IDX_fee_rules_type_currency', ['type', 'currency'], { unique: true })
export class FeeRules extends Model {
  @ApiProperty({
    type: String,
    enum: TransactionType,
  })
  @Column({
    name: 'type',
    type: 'text',
    enum: TransactionType,
  })
  type!: TransactionType;

  @ApiProperty({
    type: String,
    enum: Currency,
  })
  @Column({
    name: 'currency',
    type: 'text',
    enum: Currency,
  })
  currency!: Currency;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @Column({
    name: 'fixed_rate',
    type: 'double precision',
    default: 0.0,
  })
  fixedRate?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @Column({
    name: 'tax_percent',
    type: 'double precision',
    default: 0.0,
  })
  taxPercent?: number;
}
