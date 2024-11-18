import { RepositoryInterface } from '@libs/interfaces/repository';
import { AddFundsDTO } from '../dto';

export interface PaymentAccountRepositoryInterface extends RepositoryInterface {
  addFunds(id: string, dto: AddFundsDTO): any;
}
