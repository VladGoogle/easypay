import { QueryRunner } from 'typeorm';
import { GetOneReceiptDTO } from '../dto';

export interface GetOneReceipt {
  id: string;
  runner?: QueryRunner;
  dto?: GetOneReceiptDTO;
}
