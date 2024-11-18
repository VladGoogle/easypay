import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { GetOne } from '@libs/interfaces/repository';

import { ACCOUNT_REPOSITORY_TOKEN } from './constants';
import { PaymentAccount, User } from '@libs/entities';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { isEmpty } from 'lodash';
import { BodyIsEmptyException, ByIdNotFoundException } from '@libs/exceptions';
import { AddFundsDTO, ListAccountsDTO } from './dto';
import { AccountStatus } from '@libs/enums/accounts';
import { PaginatedList } from '@libs/interfaces/common';
import { PaymentAccountRepositoryInterface } from './interfaces';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly repository: PaymentAccountRepositoryInterface,
  ) {}

  public async getOne(id: string): Promise<PaymentAccount> {
    const filter: FindOptionsWhere<PaymentAccount> = {
      id,
    };

    const data: GetOne<FindOptionsWhere<PaymentAccount>> = {
      filter,
    };

    return this.repository.getOne(data);
  }

  public async index(
    dto: ListAccountsDTO,
  ): Promise<PaginatedList<PaymentAccount>> {
    return this.repository.index(dto);
  }

  public async create(
    dto: DeepPartial<PaymentAccount>,
    params: User,
  ): Promise<PaymentAccount> {
    const data: DeepPartial<PaymentAccount> = {
      ...dto,
      status: AccountStatus.PENDING,
      userId: params.id,
      id: uuidv7(),
    };

    return this.repository.create(data);
  }

  public async update(
    id: string,
    dto: DeepPartial<PaymentAccount>,
  ): Promise<PaymentAccount> {
    const filter: FindOptionsWhere<PaymentAccount> = {
      id,
    };

    const updateQuery: DeepPartial<PaymentAccount> = dto;

    if (isEmpty(updateQuery)) {
      throw new BodyIsEmptyException();
    }

    return this.repository.update(filter, updateQuery);
  }

  public async addFunds(id: string, dto: AddFundsDTO): Promise<PaymentAccount> {
    return this.repository.addFunds(id, dto);
  }

  public async delete(id: string, params: User): Promise<PaymentAccount> {
    const filter: FindOptionsWhere<PaymentAccount> = {
      userId: params.id,
      id,
    };

    const data: GetOne<any> = {
      filter,
    };

    const account: PaymentAccount = await this.repository.getOne(data);

    if (!account) {
      throw new ByIdNotFoundException(PaymentAccount, id);
    }

    if (account.userId !== params.id) {
      throw new ForbiddenException(
        `You don't have permission to delete this account`,
      );
    }

    return this.repository.delete(id);
  }
}
