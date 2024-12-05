import { SnsNotification } from './sns-notification.interface';

export interface NotificationHandlerInterface {
  handle(notification: SnsNotification): void;
}
