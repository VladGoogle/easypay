import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Receipt } from '@libs/entities';
import { ByIdNotFoundException } from '@libs/exceptions';

import { CreateReceipt, GetOneReceipt } from './interfaces';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private readonly repository: Repository<Receipt>,
  ) {}

  async getOne(data: GetOneReceipt): Promise<Receipt> {
    const { id } = data;

    const builder = this.repository.createQueryBuilder('r');

    const where: FindOptionsWhere<Receipt> = {
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
          builder.leftJoinAndSelect(`r.${relation}`, relation);
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
      throw new ByIdNotFoundException(Receipt, id);
    }

    return res;
  }

  public async create(dto: CreateReceipt): Promise<Receipt | never> {
    try {
      const item = this.repository.create(dto);

      await this.repository.save(item);

      return item;
    } catch (e) {
      throw e;
    }
  }
}
