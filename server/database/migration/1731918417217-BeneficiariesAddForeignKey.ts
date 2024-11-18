import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class BeneficiariesAddForeignKey1731918417217 implements MigrationInterface {

    public get _tableBeneficiaries(): string {
        return 'beneficiaries';
    }

    public get _tableAccounts(): string {
        return 'payment_accounts';
    }

    public get _foreignKey(): TableForeignKey {
        return new TableForeignKey({
                columnNames: ['account_id'],
                referencedTableName: this._tableAccounts,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                name: `${this._tableBeneficiaries}_${this._tableAccounts}_account_id_id_fk`,
            })
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(this._tableBeneficiaries, this._foreignKey)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(this._tableBeneficiaries, this._foreignKey)
    }

}
