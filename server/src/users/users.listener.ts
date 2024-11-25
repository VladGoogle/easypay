import { Inject } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { Name } from '@libs/enums/queue';
import { SocketEvent } from '@libs/interfaces/socket';
import { QueueClientService } from '@libs/queue-client';
import { USER_REPOSITORY_TOKEN } from './constants';
import { UserRepositoryInterface } from '@libs/interfaces/users';
import { FirebaseMessage } from '@libs/interfaces/firebase';

@Processor(Name.MessagingHub)
export class UserListener {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly repository: UserRepositoryInterface,
    private readonly queue: QueueClientService,
  ) {}

  @Process('user.update')
  async update(job: Job) {
    const { where, update } = job.data;

    const res = await this.repository.update(where, update);

    if (res && update.status) {
      const event: SocketEvent = {
        name: 'applicantStatusUpdated',
        userId: where.id,
        payload: update,
      };

      const message = {
        status: update.status,
      };

      await this.queue.messagingHub.add('socket.emit', {
        event,
      });

      if (res?.fcmTokens?.length) {
        const fcmTokens = res.fcmTokens;

        const notification = {
          title: 'Alert!',
          body: `Your SumSub applicant status has been updated`,
        };

        for (const token of fcmTokens) {
          const data: FirebaseMessage = {
            notification,
            message,
            id: res.id,
            token,
          };

          await this.queue.messagingHub.add('firebase.send', {
            data,
          });
        }
      }
    }
  }

  @Process('user.remove-token')
  async removeFcmToken(job: Job) {
    const { where, token } = job.data;

    return this.repository.deleteFcmToken(where, token);
  }
}
