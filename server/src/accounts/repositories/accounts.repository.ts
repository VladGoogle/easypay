import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { isObject } from 'lodash';

import { PaymentAccount, User } from '@libs/entities';
import {
  ByIdNotFoundException,
  CustomNotFoundException,
} from '@libs/exceptions';
import { GetOne } from '@libs/interfaces/repository';
import { pgReturning } from '@libs/utils';
import { AddFundsDTO, ListAccountsDTO } from '../dto';
import { PaginatedList } from '@libs/interfaces/common';
import { QueueClientService } from '@libs/queue-client';
import { PaymentMethod } from '@libs/interfaces/stripe';
import { PaymentAccountRepositoryInterface } from '../interfaces';

@Injectable()
export class AccountsRepository implements PaymentAccountRepositoryInterface {
  constructor(
    @InjectRepository(PaymentAccount)
    private readonly repository: Repository<PaymentAccount>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly queue: QueueClientService,
  ) {}

  async getOne(data: GetOne<any>): Promise<PaymentAccount | null> {
    const builder = this.repository.createQueryBuilder('a');

    let filterPayload;

    if (isObject(data.filter)) {
      filterPayload = { ...data.filter } as FindOptionsWhere<User>;
    } else {
      filterPayload = data.filter as FindOptionsWhere<User>;
    }

    const where: FindOptionsWhere<PaymentAccount> = filterPayload;

    if (data.runner) {
      builder
        .setQueryRunner(data.runner)
        .useTransaction(true)
        .setLock('pessimistic_write');
    }

    if (data?.select?.length) {
      for (const field of data.select) {
        builder.addSelect(field);
      }
    }

    if (data?.dto?.include?.length) {
      for (const relation of data?.dto?.include?.length) {
        builder.leftJoinAndSelect(`a.${relation}`, relation);
      }
    }

    try {
      return await builder.where(where).getOne();
    } catch (e) {
      throw e;
    }
  }

  public async index(
    dto: ListAccountsDTO,
  ): Promise<PaginatedList<PaymentAccount> | never> {
    const { limit = 25, offset = 0 } = dto;

    const { include } = dto;

    const builder = this.repository.createQueryBuilder('a');

    const where: FindOptionsWhere<PaymentAccount> = {};

    if (dto?.phone) {
      builder.leftJoinAndSelect(`a.user`, 'u');
      builder.andWhere('u.phone = :phone', { phone: dto.phone });
    }

    if (dto?.userId) {
      where.userId = dto.userId;
    }

    if (dto?.status) {
      where.status = dto.status;
    }

    if (dto?.currency) {
      where.currency = dto.currency;
    }

    if (dto?.accountNumber) {
      where.accountNumber = dto.accountNumber;
    }

    if (dto?.iban) {
      where.iban = dto.iban;
    }

    if (dto?.sortCode) {
      where.sortCode = dto.sortCode;
    }

    if (dto?.bic) {
      where.bic = dto.bic;
    }

    if (include?.length) {
      for (const relation of include) {
        builder.leftJoinAndSelect(`a.${relation}`, relation);
      }
    }

    try {
      const [data, total] = await Promise.all([
        builder.where(where).offset(offset).limit(limit).getMany(),
        builder.getCount(),
      ]);

      return {
        data,
        meta: { offset, limit, total },
      };
    } catch (e) {
      throw e;
    }
  }

  public async create(
    dto: DeepPartial<PaymentAccount>,
  ): Promise<PaymentAccount | never> {
    try {
      const item = this.repository.create(dto);

      await this.repository.save(item);

      const builder = await this.userRepository.createQueryBuilder('u');

      const where: FindOptionsWhere<User> = {
        id: dto.userId,
      };

      const user = (await builder.where(where).getOne()) as User;

      const jobData = {
        accountId: item.id,
        name: user.fullName,
        email: user.email,
        customer: user.stripeCustomerId,
        iban: dto.iban,
      } as PaymentMethod;

      await this.queue.messagingHub.add('stripe.payment-method.create', {
        ...jobData,
      });

      return item;
    } catch (e) {
      throw e;
    }
  }

  public async update(
    where: FindOptionsWhere<PaymentAccount>,
    dto: DeepPartial<PaymentAccount>,
  ): Promise<PaymentAccount | never> {
    const runner = this.repository.manager.connection.createQueryRunner();

    await runner.connect();
    await runner.startTransaction();

    try {
      const getOnePayload: GetOne<any> = {
        filter: where,
        runner,
      };

      const item = (await this.getOne(getOnePayload)) as PaymentAccount;

      const { raw: result } = await this.repository
        .createQueryBuilder()
        .useTransaction(true)
        .setQueryRunner(runner)
        .update()
        .where(where)
        .set(dto)
        .returning(pgReturning(this.repository))
        .execute();

      await runner.commitTransaction();

      const [returned] = result as [PaymentAccount];

      if (!returned) {
        throw new CustomNotFoundException(PaymentAccount);
      }

      const res = this.repository.merge(item, returned);

      return res;
    } catch (e: any) {
      if (e.code === 404) {
        console.log(e);
        throw new CustomNotFoundException(PaymentAccount);
      }

      await runner.rollbackTransaction();
      console.log(e);
      throw e;
    } finally {
      await runner.release();
    }
  }

  public async addFunds(id: string, dto: AddFundsDTO): Promise<PaymentAccount> {
    const { amount } = dto;

    const runner = this.repository.manager.connection.createQueryRunner();

    await runner.connect();
    await runner.startTransaction();

    try {
      const where: FindOptionsWhere<PaymentAccount> = {
        id,
      };

      const getOnePayload: GetOne<any> = {
        filter: where,
        runner,
      };

      const item = (await this.getOne(getOnePayload)) as PaymentAccount;

      const { raw: result } = await this.repository
        .createQueryBuilder()
        .useTransaction(true)
        .setQueryRunner(runner)
        .update()
        .where(where)
        .set({
          actualBalance: () => `actualBalance + ${amount}`,
          pendingBalance: () => `pendingBalance + ${amount}`,
        })
        .returning(pgReturning(this.repository))
        .execute();

      await runner.commitTransaction();

      const [returned] = result as [PaymentAccount];

      if (!returned) {
        throw new CustomNotFoundException(PaymentAccount);
      }

      const res = this.repository.merge(item, returned);

      return res;
    } catch (e: any) {
      if (e.code === 404) {
        throw new ByIdNotFoundException(PaymentAccount, id);
      }

      await runner.rollbackTransaction();
      throw e;
    } finally {
      await runner.release();
    }
  }

  public async delete(id: string): Promise<PaymentAccount | never> {
    const runner = this.repository.manager.connection.createQueryRunner();

    await runner.connect();
    await runner.startTransaction();

    try {
      const where: FindOptionsWhere<PaymentAccount> = { id };

      const item = await this.repository
        .createQueryBuilder()
        .setQueryRunner(runner)
        .useTransaction(true)
        .setLock('pessimistic_write')
        .where(where)
        .getOne();

      if (!item) {
        throw new ByIdNotFoundException(PaymentAccount, id);
      }

      const {
        raw: [returned],
      } = await this.repository
        .createQueryBuilder()
        .setQueryRunner(runner)
        .useTransaction(true)
        .softDelete()
        .from(User)
        .where(where)
        .returning(pgReturning(this.repository))
        .execute();

      await runner.commitTransaction();

      return this.repository.merge(item, returned);
    } catch (e) {
      await runner.rollbackTransaction();
      throw e;
    } finally {
      await runner.release();
    }
  }
}
