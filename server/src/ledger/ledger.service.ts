import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FundLedger } from '@libs/entities';
import {
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { ByIdNotFoundException } from '@libs/exceptions';
import { ListLedgerTransactionsDTO } from './dto';
import { PaginatedList } from '@libs/interfaces/common';
import { GetOneLedgerTransaction } from './interfaces';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(FundLedger)
    private readonly repository: Repository<FundLedger>,
  ) {}

  async getOne(data: GetOneLedgerTransaction): Promise<FundLedger> {
    const { id } = data;

    const builder = this.repository.createQueryBuilder('l');

    const where: FindOptionsWhere<FundLedger> = {
      id,
    };

    if (data?.runner) {
      builder
        .setQueryRunner(data.runner)
        .useTransaction(true)
        .setLock('pessimistic_write');
    }

    this.includeToQuery(builder, data?.dto?.include);

    let res;

    try {
      res = await builder.where(where).getOne();
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!res) {
      throw new ByIdNotFoundException(FundLedger, id);
    }

    return res;
  }

  public async index(
    dto: ListLedgerTransactionsDTO,
  ): Promise<PaginatedList<FundLedger> | never> {
    const { limit = 25, offset = 0 } = dto;

    const { accountId } = dto;

    const builder = this.repository.createQueryBuilder('l');

    const where: FindOptionsWhere<FundLedger> = {
      accountId,
    };

    this.includeToQuery(builder, dto?.include);

    if (dto?.statuses) {
      builder.andWhere('transaction.status IN (:...statuses)', {
        statuses: dto?.statuses,
      });
    }

    if (dto.createdAt) {
      const [from, to] = dto.createdAt;

      if (from) {
        const andWhere: FindOptionsWhere<FundLedger> = {
          createdAt: MoreThanOrEqual(from),
        };
        builder.andWhere(andWhere);
      }

      if (to) {
        const andWhere: FindOptionsWhere<FundLedger> = {
          createdAt: LessThanOrEqual(to),
        };
        builder.andWhere(andWhere);
      }
    }

    for (const sortField of dto.sort) {
      let by: 'ASC' | 'DESC' = 'ASC';
      let field = sortField;

      if (sortField[0] === '-') {
        by = 'DESC';
        field = sortField.substring(1);
      }

      if (field.includes('.')) {
        builder.addOrderBy(field, by);
      } else {
        builder.addOrderBy(`l.${field}`, by);
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

  private includeToQuery(
    builder: SelectQueryBuilder<FundLedger>,
    include?: string[],
  ): void {
    const fields = new Set(include || []);

    builder.leftJoinAndSelect('l.transaction', 'transaction');

    if (fields.has('account')) {
      builder.leftJoinAndSelect('l.account', 'account');
    }

    if (fields.has('receiverAccount')) {
      builder.leftJoinAndSelect(
        'transaction.receiverAccount',
        'receiverAccount',
      );
    }

    if (fields.has('senderAccount')) {
      builder.leftJoinAndSelect('transaction.senderAccount', 'senderAccount');
    }

    if (fields.has('senderAccount.user')) {
      builder.leftJoinAndSelect('senderAccount.user', 'su');
    }

    if (fields.has('receiverAccount.user')) {
      builder.leftJoinAndSelect('receiverAccount.user', 'ru');
    }
  }
}
