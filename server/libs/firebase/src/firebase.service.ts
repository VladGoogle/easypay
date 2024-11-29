import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { FindOptionsWhere } from 'typeorm';

import { FirebaseConfigService } from '@libs/config';
import { User } from '@libs/entities';
import { FirebaseMessage, VerifyResponse } from '@libs/interfaces/firebase';
import { GetOne } from '@libs/interfaces/repository';

import { USER_REPOSITORY_TOKEN } from '../../../src/users/constants';
import { QueueClientService } from '@libs/queue-client';
import { UserRepositoryInterface } from '@libs/interfaces/users';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public firebaseApp;
  private readonly logger = new Logger(FirebaseService.name);

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly repository: UserRepositoryInterface,
    private readonly config: FirebaseConfigService,
    private readonly queue: QueueClientService,
  ) {}

  onModuleInit(): any {
    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp({
        credential: firebase.credential.cert({
          projectId: this.config.projectId,
          privateKey: this.config.privateKey,
          clientEmail: this.config.clientEmail,
        }),
      });
    }
  }

  async verify(
    token: string,
    fcmToken?: string,
  ): Promise<VerifyResponse<User>> {
    let decodedToken;

    try {
      decodedToken = await firebase.auth().verifyIdToken(token);
    } catch (e: any) {
      this.logger.error(e.stack);
      throw new UnauthorizedException(
        'The Firebase token is invalid or expired',
      );
    }

    const { email } = decodedToken;

    let user;

    const where: FindOptionsWhere<User> = {
      email,
    };

    const getOneData: GetOne<FindOptionsWhere<User>> = {
      filter: where,
    };

    user = await this.repository.getOne(getOneData);

    let data;

    let res: VerifyResponse<User>;

    if (!user) {
      data = { email };

      res = {
        isRegistered: false,
        payload: data,
      };
    } else {
      if (fcmToken) {
        const { fcmTokens } = await this.repository.addFcmToken(
          where,
          fcmToken,
        );

        user.fcmTokens = fcmTokens;
      }

      res = {
        isRegistered: true,
        payload: user,
      };
    }

    return res;
  }

  async send(data: FirebaseMessage): Promise<any> {
    const { message, notification, token } = data;

    try {
      const body = JSON.stringify(message);

      const payload = {
        notification,
        data: {
          body,
        },
        token,
      };

      return await firebase.messaging(this.firebaseApp).send(payload);
    } catch (e: any) {
      if (
        (e.errorInfo.message.includes('Requested entity was not found') ||
          e.errorInfo.message.includes(
            'The registration token is not a valid FCM registration token',
          )) &&
        data?.id
      ) {
        const where: FindOptionsWhere<User> = {
          id: data.id,
        };

        await this.queue.messagingHub.add('user.remove-token', {
          where,
          token,
        });
      }

      console.log(e);
    }
  }
}
