import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Beneficiary } from '@libs/entities';
import { ByIdNotFoundException } from '@libs/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBeneficiary } from '@libs/interfaces/beneficiary';
import { GetOneBeneficiary } from './interfaces';

@Injectable()
export class BeneficiariesService {
  constructor(
    @InjectRepository(Beneficiary)
    private readonly repository: Repository<Beneficiary>,
  ) {}

  async getOne(data: GetOneBeneficiary): Promise<Beneficiary> {
    const { id } = data;

    const builder = this.repository.createQueryBuilder('b');

    const where: FindOptionsWhere<Beneficiary> = {
      id,
    };

    if (data?.runner) {
      builder
        .setQueryRunner(data.runner)
        .useTransaction(true)
        .setLock('pessimistic_write');
    }

    if (data?.dto?.include) {
      for (const relation of data?.dto?.include) {
        builder.leftJoinAndSelect(`b.${relation}`, relation);
      }
    }

    let res;

    try {
      res = await builder.where(where).getOne();
    } catch (e) {
      throw e;
    }

    if (!res) {
      throw new ByIdNotFoundException(Beneficiary, id);
    }

    return res;
  }

  public async create(dto: CreateBeneficiary): Promise<Beneficiary | never> {
    try {
      const item = this.repository.create(dto);

      await this.repository.save(item);

      return item;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
