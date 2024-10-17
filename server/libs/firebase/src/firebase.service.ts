import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import {FindOptionsWhere} from "typeorm";

import { FirebaseConfigService } from '@libs/config';
import {User} from "@libs/entities";
import {VerifyResponse} from "@libs/interfaces/firebase";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";

import {USER_REPOSITORY_TOKEN} from "../../../src/users/constants";

@Injectable()
export class FirebaseService implements OnModuleInit {
  public firebaseApp;
  private readonly logger = new Logger(FirebaseService.name);

  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface,
    private readonly config: FirebaseConfigService,
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

  async verify(token: string): Promise<VerifyResponse<User>> {
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
      email
    }

    const getOneData: GetOne<FindOptionsWhere<User>> = {
      filter: where
    }

    user = await this.repository.getOne(getOneData)

    let data;

    let res: VerifyResponse<User>

    if (!user) {
      data = {email}

      res = {
        isRegistered: false,
        payload: data
      }
    } else {
      data = {
        id: user.id,
        email: user.email,
      }

      res = {
        isRegistered: true,
        payload: data
      }
    }

    return res
  }
}
