import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { toFileStream } from 'qrcode';

import { User } from '@libs/entities';

import { TwoFactorConfigService } from '@libs/config';
import { QueueClientService } from '@libs/queue-client';

import { Generate2faSecret } from './interfaces';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly config: TwoFactorConfigService,
    private readonly queue: QueueClientService,
  ) {}

  public async generateTwoFactorAuthenticationSecret(
    params: User,
  ): Promise<Generate2faSecret> {
    const { id, email } = params;

    try {
      const secret = authenticator.generateSecret();

      const url = authenticator.keyuri(email, this.config.appName, secret);

      const where: FindOptionsWhere<User> = {
        id,
      };

      const update: DeepPartial<User> = {
        twoFactorAuthenticationSecret: secret,
      };

      await this.queue.messagingHub.add('user.update', {
        where,
        update,
      });

      return {
        secret,
        url,
      };
    } catch (e) {
      throw e;
    }
  }

  public async pipeQrCodeStream(stream: Response, params: User) {
    const { url } = await this.generateTwoFactorAuthenticationSecret(params);

    return toFileStream(stream, url);
  }

  public verifyCode(code: string, user: User) {
    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorAuthenticationSecret as string,
    });

    if (!isValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return isValid;
  }
}
