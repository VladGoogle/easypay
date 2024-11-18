import { GetOne } from './get-one.interface';

export interface RepositoryInterface {
  getOne(data: GetOne<any>): any;

  index(dto?: any): any;

  create(dto: any): any;

  update(where: any, update: any): any;

  delete(where: any): any;
}
