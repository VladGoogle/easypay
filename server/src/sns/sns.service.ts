import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { SnsNotification } from './interfaces';
import {
  ConfirmNotificationHandlerService,
  S3NotificationHandlerService,
} from './handlers';
import { SNSNotificationTypes } from './utils';

@Injectable()
export class SnsService {
  private readonly logger = new Logger(SnsService.name);

  constructor(
    private readonly notificationService: S3NotificationHandlerService,
    private readonly confirmationHandler: ConfirmNotificationHandlerService,
  ) {}

  async processNotification(message: SnsNotification): Promise<string> {
    this.logger.log(JSON.stringify(message));

    switch (message.Type) {
      case SNSNotificationTypes.NOTIFICATION:
        await this.notificationService.handle(message);
        break;
      case SNSNotificationTypes.SUBSCRIPTION_CONFIRMATION:
        await this.confirmationHandler.handle(message);
        break;
      default:
        throw new BadRequestException('Unknown Notification Type');
    }

    return 'done';
  }
}
