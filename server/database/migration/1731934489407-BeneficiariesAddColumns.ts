import {MigrationInterface, QueryRunner, TableColumn, TableColumnOptions} from "typeorm";

export class BeneficiariesAddColumns1731934489407 implements MigrationInterface {

    public get _tableName(): string {
        return 'beneficiaries';
    }

    public get _columns(): TableColumnOptions[] {
        return [
            {
                name: 'currency',
                type: 'text',
                isNullable: false,
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
