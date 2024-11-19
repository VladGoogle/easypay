import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FundLedger } from '@libs/entities';
import {
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
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

    if (data?.dto?.include) {
      for (const relation of data.dto.include) {
        const splitRelation = relation.split('.');

        if (splitRelation.length > 1) {
          builder.leftJoinAndSelect(`l.${splitRelation[0]}`, splitRelation[0]);

          let prev = splitRelation[0];

          for (let i = 1; i < splitRelation.length; i++) {
            builder.leftJoinAndSelect(
              `${prev}.${splitRelation[i]}`,
              splitRelation[i],
            );

            prev = splitRelation[i];
          }
        } else {
          builder.leftJoinAndSelect(`l.${relation}`, relation);
        }
      }
    }

    let res;

    try {
      res = await builder.where(where).getOne();
    } catch (e) {
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

    builder.leftJoinAndSelect('l.transaction', 'transaction');

    if (dto?.statuses) {
      builder.andWhere('transaction.status IN (:...statuses)', {
        statuses: dto?.statuses,
      });
    }

    if (dto?.currencies) {
      builder.andWhere('transaction.currency IN (:...currencies)', {
        currencies: dto?.currencies,
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
}
