import { QueryRunner } from 'typeorm';
import { GetOneLedgerTransactionsDTO } from '../dto';

export interface GetOneLedgerTransaction {
  id: string;
  runner?: QueryRunner;
  dto?: GetOneLedgerTransactionsDTO;
}
