import { BullModule } from '@nestjs/bull';
import {Global, Module} from '@nestjs/common';
import { JobOptions } from 'bull';

import { RedisConfigModule, RedisConfigService } from '@libs/config';
import { Name } from '@libs/enums/queue';

import { QueueClientService } from './queue-client.service';

const defaultJobOptions: JobOptions = {
  removeOnComplete: true,
  removeOnFail: true,
};

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisConfigModule],
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => ({
        redis: config.connForQueues,
        defaultJobOptions
      }),
    }),
    BullModule.registerQueue(
        { name: Name.MessagingHub },
    ),
  ],
  providers: [QueueClientService],
  exports: [QueueClientService],
})
export class QueueClientModule {}
