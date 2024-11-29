import {MigrationInterface, QueryRunner, TableColumn, TableColumnOptions} from "typeorm";

export class UserAddColumns1732276310189 implements MigrationInterface {

    public get _tableName(): string {
        return 'users';
    }

    public get _columns(): TableColumnOptions[] {
        return [
            {
                name: 'fcm_tokens',
                type: 'text',
                isArray: true,
                isNullable: true,
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
