import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import {InitialCommitDb1721057034546} from "./1721057034546-InitialCommitDb";

export class Invoices1732096486784 extends InitialCommitDb1721057034546 implements MigrationInterface {

    public get _tableName(): string {
        return 'invoices';
    }

    public get _tableAccounts(): string {
        return 'payment_accounts';
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: this._tableName,
                columns: [
                    ...this.getModelColumns(`${this._tableName}_id_pk`),
                    {
                        name: 'account_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'key',
                        type: 'text',
                        isUnique: true,
                        isNullable: false,
                    },
                    ...this._editableColumns,
                ],
            }),
            true,
        );

        await queryRunner.createForeignKeys(this._tableName, [
            new TableForeignKey({
                columnNames: ['account_id'],
                referencedTableName: this._tableAccounts,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                name: `${this._tableName}_${this._tableAccounts}_account_id_id_fk`,
            })
        ]);
    }

    public down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropTable(this._tableName, true, true, true);
    }

}
