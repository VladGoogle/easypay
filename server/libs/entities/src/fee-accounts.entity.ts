import {Column, Entity,OneToMany} from 'typeorm';
import { Model } from './base/model.entity.base';
import { Currency } from '@libs/enums/card';
import {FeeTransaction} from "@libs/entities/fee-transactions.entity";

@Entity('fee_accounts')
export class FeeAccount extends Model {

    @Column({
        name: 'balance',
        nullable: false,
        default: 0.00,
        type: 'double precision',
    })
    balance?: number;

    @Column({
        unique: true,
        name: 'currency',
        type: 'text',
        enum: Currency,
    })
    currency!: Currency;

    @OneToMany(() => FeeTransaction, (d) => d.account, {
        cascade: true,
        eager: false,
        onDelete: 'CASCADE',
    })
    transactions?: FeeTransaction[];
}
