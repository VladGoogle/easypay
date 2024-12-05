import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { env } from 'node:process';
import { DataSource, DataSourceOptions, DeepPartial } from 'typeorm';

import {Country} from '@libs/entities';
import {v7 as uuidv7} from "uuid";

import config from '../config';

const file = '../fixtures/countries.json';

type CountryData = DeepPartial<Country>;

const main = async (): Promise<void> => {
    const content = readFileSync(resolve(__dirname, file), 'utf8');
    const items: CountryData[] = JSON.parse(content);

    const dataSource = new DataSource({
        ...(config as DataSourceOptions),
        entities: [Country],
    });

    const connection = await dataSource.initialize();
    console.log('Connection is established');

    const repository = connection.getRepository(Country);
    const emails = (env.DEFAULT_SEEDING_ADMIN_EMAIL || '').split(',');

    const toSave = await Promise.all(
        items.map(async (i, idx) => {
            const id = i.id ?? uuidv7()

            return repository.create({ ...i, id});
        }),
    );

    await repository.save(toSave);

    await connection.destroy();

    console.log('Data seeded successfully');
};

main().catch((error) => console.log(error));
