import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class FeeTransactionsChangeForeignKeys1731841639884 implements MigrationInterface {


    public get _tableFeeAccounts(): string {
        return 'fee_accounts';
    }

    public get _tableFeeTransactions(): string {
        return 'fee_transactions';
    }

    public get _tableTransactions(): string {
        return 'transactions';
    }

    public get _foreignKeys(): TableForeignKey[] {
        return [
            new TableForeignKey({
                columnNames: ['transaction_id'],
                referencedTableName: this._tableTransactions,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                name: `${this._tableFeeTransactions}_${this._tableTransactions}_transaction_id_id_fk`,
            }),
            new TableForeignKey({
                columnNames: ['fee_account_id'],
                referencedTableName: this._tableFeeAccounts,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                name: `${this._tableFeeTransactions}_${this._tableFeeAccounts}_fee_account_id_id_fk`,
            }),
        ];
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this._tableFeeTransactions, this._foreignKeys)
        await queryRunner.createForeignKeys(this._tableFeeTransactions, this._foreignKeys)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this._tableFeeTransactions, this._foreignKeys)
    }

}
