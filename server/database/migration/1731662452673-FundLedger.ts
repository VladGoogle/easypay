import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import {InitialCommitDb1721057034546} from "./1721057034546-InitialCommitDb";

export class FundLedger1731662452673 
    extends InitialCommitDb1721057034546 implements MigrationInterface {

    public get _tableName(): string {
        return 'fund_ledger';
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: this._tableName,
                columns: [
                    ...this.getModelColumns(`${this._tableName}_id_pk`),
                    {
                        name: 'transaction_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'account_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'net_amount',
                        type: 'double precision',
                        isNullable: false,
                    },
                    {
                        name: 'pit_balance_before',
                        type: 'double precision',
                        isNullable: false,
                    },
                    {
                        name: 'pit_balance_after',
                        type: 'double precision',
                        isNullable: false,
                    },
                    {
                        name: 'direction_type',
                        type: 'text',
                        isNullable: false,
                    },
                    ...this._editableColumns,
                ],
            }),
            true,
        );

        await queryRunner.createForeignKeys(this._tableName, [
            new TableForeignKey({
                columnNames: ['transaction_id'],
                referencedTableName: this._tableTransactions,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                name: `${this._tableName}_${this._tableTransactions}_transaction_id_id_fk`,
            }),
            new TableForeignKey({
                columnNames: ['account_id'],
                referencedTableName: this._tablePaymentAccounts,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                name: `${this._tableName}_${this._tablePaymentAccounts}_account_id_id_fk`,
            })
        ]);
    }

    public down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropTable(this._tableName, true, true, true);
    }

}
