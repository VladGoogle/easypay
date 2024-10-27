import {MigrationInterface, QueryRunner, TableColumn, TableColumnOptions} from "typeorm";

export class UsersAddColumns1729954810306 implements MigrationInterface {
    public get _tableName(): string {
        return 'users';
    }

    public get _columns(): TableColumnOptions[] {
        return [
            {
                name: 'is_two_factor_auth_enabled',
                type: 'boolean',
                isNullable: false,
                default: false,
            },
            {
                name: 'two_factor_auth_secret',
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
    }

    public down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropColumns(
            this._tableName,
            this._columns.map((c) => c.name),
        );
    }
}
