import { Injectable, Logger } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { v7 as uuidv7 } from 'uuid';

import { AWSClientService } from '@libs/aws-client';
import { AWSConfigService } from '@libs/config';
import { Invoice, Receipt } from '@libs/entities';
import { CreateStatement } from '@libs/interfaces/common';
import { ObjectMetadata } from '@libs/interfaces/s3';
import { QueueClientService } from '@libs/queue-client';

import { NotificationHandlerInterface, SnsNotification } from '../interfaces';

@Injectable()
export class S3NotificationHandlerService
  implements NotificationHandlerInterface
{
  private readonly logger = new Logger(S3NotificationHandlerService.name);

  constructor(
    private readonly awsService: AWSClientService,
    private readonly config: AWSConfigService,
    private readonly queue: QueueClientService,
  ) {}

  async handle(notification: SnsNotification): Promise<void> {
    const message = JSON.parse(notification.Message);

    const s3Obj = message['Records'][0]['s3'];

    const bucket = s3Obj['bucket']['name'];

    const key = s3Obj['object']['key'];

    const id = uuidv7();

    const entityId = key.split('/');

    let jobName;

    let dto: Partial<Receipt> | Partial<Invoice> = {};

    const headParams = {
      Key: key,
      Bucket: bucket,
    };

    switch (bucket) {
      case this.config.receiptsBucket:
        jobName = 'receipt.create';

        dto = {
          id,
          ledgerId: entityId[entityId.length - 1],
          key,
        };

        break;
      case this.config.invoicesBucket:
        jobName = 'invoice.create';

        dto = {
          id,
          accountId: entityId[3],
          key,
        };

        break;

      default:
        this.logger.log(
          `Event notification from unknown bucket; messageId = ${notification.MessageId}; bucket = ${bucket}`,
        );
    }

    const data = { dto } as CreateStatement<Receipt | Invoice>;

    const head = await this.awsService.s3.getObject(headParams).promise();

    const metadata = head.Metadata as unknown as ObjectMetadata;

    if (!isEmpty(metadata)) {
      if (metadata?.tokens?.length) {
        data.tokens = metadata.tokens;
      }

      data.userId = metadata.userId;
    }

    await this.queue.messagingHub.add(jobName, {
      data,
    });
  }
}
