import { RepositoryInterface } from '@libs/interfaces/repository';

export interface UserRepositoryInterface extends RepositoryInterface {
  addFcmToken(where: any, token: string): any;
  deleteFcmToken(where: any, token: string): any;
}
