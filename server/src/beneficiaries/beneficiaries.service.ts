import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Beneficiary, User } from '@libs/entities';
import { ByIdNotFoundException } from '@libs/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBeneficiary } from '@libs/interfaces/beneficiary';
import { ElasticBeneficiariesDoc, GetOneBeneficiary } from './interfaces';
import { QueueClientService } from '@libs/queue-client';
import { PaginatedList } from '@libs/interfaces/common';
import { ListBeneficiariesDTO } from './dto/list.dto';
import { FuzzySearch } from '@libs/interfaces/elastic';
import { ElasticService } from '../elastic';
import { AddElasticDocument } from '../elastic/interfaces/add-document.interface';

@Injectable()
export class BeneficiariesService {
  constructor(
    @InjectRepository(Beneficiary)
    private readonly repository: Repository<Beneficiary>,
    private readonly elastic: ElasticService,
    private readonly queue: QueueClientService,
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

  public async index(
    dto: ListBeneficiariesDTO,
    params: User,
  ): Promise<PaginatedList<Beneficiary> | never> {
    const { limit = 25, offset = 0 } = dto;

    const { include } = dto;

    const builder = this.repository.createQueryBuilder('b');

    const where: FindOptionsWhere<Beneficiary> = {
      userId: params.id,
    };

    const elasticRecords: FuzzySearch[] = [];

    if (dto?.fullName) {
      elasticRecords.push({
        field: 'fullName',
        query: dto.fullName,
      });
    }

    if (dto?.phone) {
      elasticRecords.push({
        field: 'phone',
        query: dto.phone,
      });
    }

    if (elasticRecords?.length) {
      const items = await this.elastic.searchFuzzyIndices(
        'beneficiaries',
        elasticRecords,
      );

      if (items?.length) {
        const ids = items.map((item) => {
          return item._id;
        });

        where.id = In(ids);
      }
    }

    if (include?.length) {
      for (const relation of include) {
        const splitRelation = relation.split('.');

        if (splitRelation.length > 1) {
          builder.leftJoinAndSelect(`b.${splitRelation[0]}`, splitRelation[0]);

          let prev = splitRelation[0];

          for (let i = 1; i < splitRelation.length; i++) {
            builder.leftJoinAndSelect(
              `${prev}.${splitRelation[i]}`,
              splitRelation[i],
            );

            prev = splitRelation[i];
          }
        } else {
          builder.leftJoinAndSelect(`b.${relation}`, relation);
        }
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

  public async create(dto: CreateBeneficiary): Promise<Beneficiary | never> {
    try {
      const item = this.repository.create(dto);

      await this.repository.save(item);

      const doc: ElasticBeneficiariesDoc = {
        fullName: `${dto.firstName} ${dto.lastName}`,
        phone: item?.phone,
      };

      const elasticData: AddElasticDocument<ElasticBeneficiariesDoc> = {
        id: item.id,
        index: 'beneficiaries',
        document: doc,
      };

      await this.queue.messagingHub.add('elastic.add.document', {
        ...elasticData,
      });

      return item;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
