import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import {InitialCommitDb1721057034546} from "./1721057034546-InitialCommitDb";

export class Receipts1732095599483 extends InitialCommitDb1721057034546 implements MigrationInterface {

    public get _tableName(): string {
        return 'receipts';
    }

    public get _tableLedger(): string {
        return 'fund_ledger';
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: this._tableName,
                columns: [
                    ...this.getModelColumns(`${this._tableName}_id_pk`),
                    {
                        name: 'ledger_id',
                        type: 'uuid',
                        isUnique: true,
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
                columnNames: ['ledger_id'],
                referencedTableName: this._tableLedger,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                name: `${this._tableName}_${this._tableLedger}_ledger_id_id_fk`,
            })
        ]);
    }

    public down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropTable(this._tableName, true, true, true);
    }

}
