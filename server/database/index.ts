import 'reflect-metadata';

import dataSource from './data-source';

const main = async (): Promise<void> => {
  const connection = await dataSource.initialize();

  console.log('Connection is established');
  await connection.destroy();
};

main().catch((error) => console.log(error));
