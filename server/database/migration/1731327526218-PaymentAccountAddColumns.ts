import {MigrationInterface, QueryRunner, TableColumn, TableColumnOptions, TableForeignKey} from "typeorm";

export class PaymentAccountAddColumns1729954810306 implements MigrationInterface {
    public get _tableName(): string {
        return 'payment_accounts';
    }

    public get _tableCountries(): string {
        return 'countries';
    }

    public get _columns(): TableColumnOptions[] {
        return [
            {
                name: 'country_id',
                type: 'uuid',
                isNullable: false,
            },
            {
                name: 'status',
                type: 'text',
                isNullable: false
            },
            {
                name: 'resubmission_reason',
                type: 'text',
                isNullable: true,
            },
        ];
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(
            this._tableName,
            this._columns.map((c) => new TableColumn(c)),
        );

        await queryRunner.createForeignKey(
            this._tableName,
            new TableForeignKey({
                columnNames: ['country_id'],
                referencedTableName: this._tableCountries,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                name: `${this._tableName}_${this._tableCountries}_country_id_id_fk`,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(this._tableName, `${this._tableName}_${this._tableCountries}_country_id_id_fk`)
        return queryRunner.dropColumns(
            this._tableName,
            this._columns.map((c) => c.name),
        );
    }
}
