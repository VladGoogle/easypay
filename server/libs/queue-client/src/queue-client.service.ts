import {InjectQueue} from '@nestjs/bullmq';
import {Injectable} from '@nestjs/common';
import {Queue} from 'bullmq';

import {Name} from '@libs/enums/queue';

@Injectable()
export class QueueClientService {
  constructor(
    @InjectQueue(Name.MessagingHub) private readonly messagingHubQueue: Queue,
  ) {}

  public get messagingHub(): Queue {
    return this.messagingHubQueue;
  }
}
