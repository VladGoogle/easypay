import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Model } from '@libs/entities/base/model.entity.base';
import { FundLedger } from '@libs/entities/fund-ledger.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('receipts')
export class Receipt extends Model {
  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'ledger_id',
    type: 'text',
    unique: true,
  })
  ledgerId!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'key',
    type: 'text',
    unique: true,
  })
  key!: string;

  @OneToOne(() => FundLedger, (d) => d.receipt)
  @JoinColumn({ name: 'ledger_id' })
  ledgerTransaction?: FundLedger;
}
