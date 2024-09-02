import {MigrationInterface, QueryRunner, Table, TableColumnOptions, TableForeignKey, TableIndex} from "typeorm";

export class InitialCommitDb1721057034546 implements MigrationInterface {

    public get _tableAddresses(): string {
        return 'addresses';
    }

    public get _tableBeneficiaries(): string {
        return 'beneficiaries';
    }

    public get _tablePaymentAccounts(): string {
        return 'payment_accounts';
    }

    public get _tableTransactions(): string {
        return 'transactions';
    }

    public get _tableUsers(): string {
        return 'users';
    }

    public get _tableCountries(): string {
        return 'countries';
    }

    public getModelColumns(keyName: string): TableColumnOptions[] {
        return [
            {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                primaryKeyConstraintName: keyName,
            },
        ];
    }

    public get _editableColumns(): TableColumnOptions[] {
        return [
            {
                name: 'created_at',
                type: 'timestamp',
                default: 'now()',
            },
            {
                name: 'updated_at',
                type: 'timestamp',
                default: 'now()',
                onUpdate: 'now()',
            },
            {
                name: 'deleted_at',
                type: 'timestamp',
                isNullable: true,
            },
        ];
    }


    public async up(queryRunner: QueryRunner): Promise<void> {

        // typeorm_metadata
        await queryRunner.createTable(
            new Table({
                name: 'typeorm_metadata',
                columns: [
                    {
                        name: 'type',
                        type: 'varchar(255)',
                        isNullable: false,
                    },
                    {
                        name: 'database',
                        type: 'varchar(255)',
                        isNullable: true,
                    },
                    {
                        name: 'schema',
                        type: 'varchar(255)',
                        isNullable: true,
                    },
                    {
                        name: 'table',
                        type: 'varchar(255)',
                        isNullable: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar(255)',
                        isNullable: true,
                    },
                    {
                        name: 'value',
                        type: 'text',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        // countries
        await queryRunner.createTable(
            new Table({
                name: this._tableCountries,
                columns: [
                    ...this.getModelColumns(`${this._tableCountries}_id_pk`),
                    {
                        name: 'name',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'code',
                        type: 'text',
                        isNullable: false,
                    },
                    ...this._editableColumns,
                ],
            }),
            true,
        )


        // addresses
        await queryRunner.createTable(
            new Table({
                name: this._tableAddresses,
                columns: [
                    ...this.getModelColumns(`${this._tableAddresses}_id_pk`),
                    {
                        name: 'country_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'district',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'city',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'first_street_line',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'second_street_line',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'post_code',
                        type: 'text',
                        isNullable: false,
                    },
                    ...this._editableColumns,
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            this._tableAddresses,
            new TableForeignKey({
                columnNames: ['country_id'],
                referencedTableName: this._tableCountries,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                name: `${this._tableAddresses}_${this._tableCountries}_country_id_id_fk`,
            }),
        );

        // users
        await queryRunner.createTable(
            new Table({
                name: this._tableUsers,
                columns: [
                    ...this.getModelColumns(`${this._tableUsers}_id_pk`),
                    {
                        name: 'email',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'phone',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'first_name',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'last_name',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'full_name',
                        type: 'text',
                        isNullable: false,
                        asExpression: "((first_name || ' '::text) || last_name)",
                        generatedType: 'STORED',
                        generatedIdentity: 'ALWAYS',
                    },
                    {
                        name: 'password',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'applicant_status',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'rejection_reason',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'stripe_customer_id',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'address_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'type',
                        type: 'text',
                        isNullable: false,
                    },
                    ...this._editableColumns,
                ],
            }),
            true,
        )

        await queryRunner.createForeignKey(
            this._tableUsers,
            new TableForeignKey({
                columnNames: ['address_id'],
                referencedTableName: this._tableAddresses,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                name: `${this._tableUsers}_${this._tableAddresses}_address_id_id_fk`,
            }),
        );


        // beneficiaries
        await queryRunner.createTable(
            new Table({
                name: this._tableBeneficiaries,
                columns: [
                    ...this.getModelColumns(`${this._tableBeneficiaries}_id_pk`),
                    {
                        name: 'first_name',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'last_name',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'full_name',
                        type: 'text',
                        isNullable: false,
                        asExpression: "((first_name || ' '::text) || last_name)",
                        generatedType: 'STORED',
                        generatedIdentity: 'ALWAYS',
                    },
                    {
                        name: 'type',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'details',
                        type: 'jsonb',
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    ...this._editableColumns,
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            this._tableBeneficiaries,
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: this._tableUsers,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                name: `${this._tableBeneficiaries}_${this._tableUsers}_user_id_id_fk`,
            }),
        );


        //payment_account
        await queryRunner.createTable(
            new Table({
                name: this._tablePaymentAccounts,
                columns: [
                    ...this.getModelColumns(`${this._tablePaymentAccounts}_id_pk`),
                    {
                        name: 'account_number',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'iban',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'bic',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'sort_code',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'stripe_payment_method_id',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'balance',
                        type: 'double precision',
                        isNullable: false,
                        default: 0.00
                    },
                    {
                        name: 'currency',
                        type: 'text',
                        isNullable: false
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    ...this._editableColumns,
                ],
            }),
            true,
        )

        await queryRunner.createForeignKey(
            this._tablePaymentAccounts,
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: this._tableUsers,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                name: `${this._tablePaymentAccounts}_${this._tableUsers}_user_id_id_fk`,
            }),
        );

        // transactions
        await queryRunner.createTable(
            new Table({
                name: this._tableTransactions,
                columns: [
                    ...this.getModelColumns(`${this._tableTransactions}_id_pk`),
                    {
                        name: 'amount',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'stripe_charge_id',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'sender_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'received_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'transaction_details',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    ...this._editableColumns,
                ],
            }),
            true,
        )

        await queryRunner.createForeignKeys(this._tableTransactions, [
            new TableForeignKey({
                columnNames: ['sender_id'],
                referencedTableName: this._tablePaymentAccounts,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                name: `${this._tableTransactions}_${this._tablePaymentAccounts}_sender_id_id_fk`,
            }),
            new TableForeignKey({
                columnNames: ['received_id'],
                referencedTableName: this._tablePaymentAccounts,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                name: `${this._tableTransactions}_${this._tablePaymentAccounts}_receiver_id_id_fk`,
            }),
        ]);



    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        const tables = [
            this._tableAddresses,
            this._tableBeneficiaries,
            this._tablePaymentAccounts,
            this._tableTransactions,
            this._tableUsers,
            this._tableCountries
        ];

        for (const table of tables) {
            await queryRunner.dropTable(table, true, true, true);
        }
    }

}
