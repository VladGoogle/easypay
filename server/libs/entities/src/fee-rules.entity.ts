import {Column, Entity, Index} from "typeorm";
import {TransactionType} from "@libs/enums/transaction";
import {Currency} from "@libs/enums/card";
import {Model} from "@libs/entities/base/model.entity.base";

@Entity('fee_rules')
@Index('IDX_fee_rules_type_currency', ['type', 'currency'], { unique: true })
export class FeeRules extends Model {

    @Column({
        name: 'type',
        type: 'text',
        enum: TransactionType
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
        default: 0.00
    })
    fixedRate?: number;

    @Column({
        name: 'tax_percent',
        type: 'double precision',
        default: 0.00
    })
    taxPercent?: number;
}