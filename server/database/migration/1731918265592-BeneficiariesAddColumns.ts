import {MigrationInterface, QueryRunner, TableColumn, TableColumnOptions} from "typeorm";

export class BeneficiariesAddColumns1731918265592 implements MigrationInterface {

    public get _tableName(): string {
        return 'beneficiaries';
    }

    public get _columns(): TableColumnOptions[] {
        return [
            {
                name: 'phone',
                type: 'text',
                isNullable: true,
            },
            {
                name: 'account_id',
                type: 'uuid',
                isNullable: true
            }
        ];
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(
            this._tableName,
            this._columns.map((c) => new TableColumn(c)),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropColumns(
            this._tableName,
            this._columns.map((c) => c.name),
        );
    }

}
