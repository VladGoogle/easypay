import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Receipt } from '@libs/entities';
import { ByIdNotFoundException } from '@libs/exceptions';

import { GetOneReceipt } from './interfaces';
import { QueueClientService } from '@libs/queue-client';
import { CreateStatement } from '@libs/interfaces/common';
import { FirebaseMessage } from '@libs/interfaces/firebase';

@Injectable()
export class ReceiptsService {
  private readonly logger = new Logger(ReceiptsService.name);

  constructor(
    @InjectRepository(Receipt)
    private readonly repository: Repository<Receipt>,
    private readonly queue: QueueClientService,
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

  public async create(
    data: CreateStatement<Receipt>,
  ): Promise<Receipt | never> {
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
          body: `Your receipt for the transaction with id = ${dto.ledgerId} is ready.`,
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
      this.logger.error(e);
      throw e;
    }
  }
}
