import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import { Model } from './base/model.entity.base';
import {TransactionStatus} from "@libs/enums/transaction/status.enum";
import {FeeAccount} from "@libs/entities/fee-accounts.entity";
import {Transaction} from "@libs/entities/transaction.entity";

@Entity('fee_transactions')
export class FeeTransaction extends Model {

    @Column({
        name: 'number',
        type: 'double precision',
    })
    amount!: number;

    @Column({
        name: 'transaction_id',
        type: 'uuid',
    })
    transactionId!: string;

    @Column({
        name: 'fee_account_id',
        type: 'uuid',
        nullable: true
    })
    feeAccountId!: string;

    @Column({
        name: 'status',
        type: 'uuid',
        enum: TransactionStatus
    })
    status!: TransactionStatus;

    @ManyToOne(() => FeeAccount, (d) => d.transactions)
    @JoinColumn({ name: 'fee_account_id' })
    account?: FeeAccount;

    @OneToOne(() => Transaction, (d) => d.feeTransaction)
    @JoinColumn({ name: 'transaction_id' })
    transaction?: Transaction;
}
