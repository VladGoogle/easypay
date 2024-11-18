import { QueryRunner } from 'typeorm';
import { GetOneBeneficiaryDTO } from '../dto';

export interface GetOneBeneficiary {
  id: string;
  dto?: GetOneBeneficiaryDTO;
  runner?: QueryRunner;
}
