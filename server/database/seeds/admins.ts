import { hash } from 'bcrypt';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { env } from 'node:process';
import { DataSource, DataSourceOptions, DeepPartial } from 'typeorm';

import { Admin } from '@libs/entities';
import {v7 as uuidv7} from "uuid";

import config from '../config';

const file = '../fixtures/admins.json';

type AdminData = DeepPartial<Admin>;

const main = async (): Promise<void> => {
  const content = readFileSync(resolve(__dirname, file), 'utf8');
  const items: AdminData[] = JSON.parse(content);

  const dataSource = new DataSource({
    ...(config as DataSourceOptions),
    entities: [Admin],
  });

  const connection = await dataSource.initialize();
  console.log('Connection is established');

  const repository = connection.getRepository(Admin);
  const emails = (env.DEFAULT_SEEDING_ADMIN_EMAIL || '').split(',');

  const toSave = await Promise.all(
    items.map(async (i, idx) => {
      const password = await hash(i.password!, 10);
      const id = i.id ?? uuidv7()
      const email = emails[idx] || i.email;

      return repository.create({ ...i, id, email, password });
    }),
  );

  await repository.save(toSave);

  await connection.destroy();

  console.log('Data seeded successfully');
};

main().catch((error) => console.log(error));
