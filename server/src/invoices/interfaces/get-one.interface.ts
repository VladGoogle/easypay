import { QueryRunner } from 'typeorm';
import { GetOneInvoiceDTO } from '../dto';

export interface GetOneInvoice {
  id: string;
  runner?: QueryRunner;
  dto?: GetOneInvoiceDTO;
}
