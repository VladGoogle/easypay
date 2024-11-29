import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import axios from 'axios';

import { NotificationHandlerInterface, SnsNotification } from '../interfaces';

@Injectable()
export class ConfirmNotificationHandlerService
  implements NotificationHandlerInterface
{
  private readonly logger = new Logger(ConfirmNotificationHandlerService.name);

  handle(notification: SnsNotification): Promise<void> {
    this.logger.log(
      `Received Subscription Confirmation Message, id=[${notification.MessageId}]`,
    );

    if (!notification.SubscribeURL) {
      throw new NotFoundException('Missing Subscribe Confirmation URL');
    }

    return this.callSubscribeURL(notification.SubscribeURL);
  }

  async callSubscribeURL(url: string): Promise<void> {
    try {
      this.logger.log(`Invoking SubscribeURL=[${url}]`);
      await axios.get(url);
      this.logger.log('Successfully Subscribed to topic');
    } catch (e) {
      this.logger.error(`Error subscribing to topic: ${e}`);
    }
  }
}
