import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice, User } from '@libs/entities';
import {
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { ByIdNotFoundException } from '@libs/exceptions';
import { GetOneInvoice } from './interfaces';
import { CreateStatement, PaginatedList } from '@libs/interfaces/common';
import { ListInvoicesDTO } from './dto';
import { QueueClientService } from '@libs/queue-client';
import { FirebaseMessage } from '@libs/interfaces/firebase';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly repository: Repository<Invoice>,
    private readonly queue: QueueClientService,
  ) {}

  async getOne(data: GetOneInvoice): Promise<Invoice> {
    const { id } = data;

    const builder = this.repository.createQueryBuilder('i');

    const where: FindOptionsWhere<Invoice> = {
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
          builder.leftJoinAndSelect(`i.${splitRelation[0]}`, splitRelation[0]);

          let prev = splitRelation[0];

          for (let i = 1; i < splitRelation.length; i++) {
            builder.leftJoinAndSelect(
              `${prev}.${splitRelation[i]}`,
              splitRelation[i],
            );

            prev = splitRelation[i];
          }
        } else {
          builder.leftJoinAndSelect(`i.${relation}`, relation);
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
      throw new ByIdNotFoundException(Invoice, id);
    }

    return res;
  }

  public async create(
    data: CreateStatement<Invoice>,
  ): Promise<Invoice | never> {
    const { dto } = data;

    try {
      const item = this.repository.create(dto);

      await this.repository.save(item);

      let fcmTokens;

      if (data?.tokens) {
        fcmTokens = JSON.parse(data.tokens)
      }

      if (fcmTokens?.length) {
        const notification = {
          title: 'Alert!',
          body: `Your invoice for the account with id = ${dto.accountId} is ready.`,
        };

        const payload = {
          key: dto.key,
        };

        const messages = fcmTokens.map((token) => {
          const fcmData: FirebaseMessage = {
            notification,
            message: payload,
            token,
            id: data.userId,
          };

          return this.queue.messagingHub.add('firebase.send', {
            data: fcmData,
          });
        });

        await Promise.all(messages);
      }

      return item;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async index(
    dto: ListInvoicesDTO,
    params: User,
  ): Promise<PaginatedList<Invoice> | never> {
    const { limit = 25, offset = 0 } = dto;

    const builder = this.repository.createQueryBuilder('i');

    const where: FindOptionsWhere<Invoice> = {};

    builder.leftJoinAndSelect('i.account', 'account');
    builder.leftJoinAndSelect('account.user', 'user');

    if (dto?.accountId) {
      where.accountId = dto.accountId;
    }

    if (dto.createdAt) {
      const [from, to] = dto.createdAt;

      if (from) {
        const andWhere: FindOptionsWhere<Invoice> = {
          createdAt: MoreThanOrEqual(from),
        };
        builder.andWhere(andWhere);
      }

      if (to) {
        const andWhere: FindOptionsWhere<Invoice> = {
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
        builder.addOrderBy(`i.${field}`, by);
      }
    }

    builder.andWhere('user.id = :id', { id: params.id });

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
