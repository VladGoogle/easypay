import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { SumsubConfigService } from '@libs/config';
import * as crypto from 'node:crypto';
import { USER_REPOSITORY_TOKEN } from '../users/constants';
import { GetOne, RepositoryInterface } from '@libs/interfaces/repository';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { User } from '@libs/entities';
import { getApplicantStatus } from './utils/utils';
import { QueueClientService } from '@libs/queue-client';
import { ByIdNotFoundException } from '@libs/exceptions';
import { SumsubTransaction } from '@libs/interfaces/sumsub';

@Injectable()
export class SumsubService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: RepositoryInterface,
    private readonly config: SumsubConfigService,
    private readonly queue: QueueClientService,
  ) {}

  async startKycFlow(userId: string) {
    const stamp = Math.floor(Date.now() / 1000).toString();

    const url = '/resources/applicants?levelName=basic-kyc-level';

    let valueToSign = `${stamp}POST${url}`;

    const data = {
      externalUserId: userId,
    };

    valueToSign += JSON.stringify(data);

    const signature = crypto
      .createHmac('sha256', this.config.secret)
      .update(valueToSign)
      .digest('hex');

    let response;

    try {
      response = await axios.post(
        'https://api.sumsub.com/resources/applicants',
        {
          externalUserId: userId,
        },
        {
          headers: {
            'X-App-Token': this.config.token,
            'X-App-Access-Ts': stamp,
            'X-App-Access-Sig': signature,
            'Content-Type': 'application/json',
          },
          params: {
            levelName: 'basic-kyc-level',
          },
        },
      );
    } catch (e: any) {
      console.error(
        'Error Response:',
        e.response ? e.response.data : e.message,
      );
      throw e;
    }

    const where: FindOptionsWhere<User> = {
      id: userId,
    };

    const update: DeepPartial<User> = {
      applicantId: response.data.applicantId,
    };

    await this.queue.messagingHub.add('user.update', {
      where,
      update,
    });

    return response.data;
  }

  async createSumsubTransaction(data: SumsubTransaction) {
    const {
      applicantId,
      transactionId,
      accountId,
      amount,
      bic,
      country,
      currency,
      date,
    } = data;

    const url =
      'https://api.sumsub.com/resources/applicants/fsdfs/kyt/txns/-/data';

    const body = {
      info: {
        direction: 'out',
        amount,
        currencyType: 'fiat',
        currencyCode: currency,
      },
      counterparty: {
        paymentMethod: { accountId, issuingCountry: country },
        institutionInfo: { code: bic },
        type: 'individual',
        externalUserId: applicantId,
      },
      txnId: transactionId,
      type: 'finance',
      txnDate: date,
    };

    if (data?.paymentDetails) {
      body.info['paymentDetails'] = data.paymentDetails;
    }

    const config: AxiosRequestConfig = {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-App-Token': this.config.token,
      },
    };

    let response;

    try {
      response = await axios.post(url, body, config);
    } catch (e) {
      throw e;
    }

    console.log(response);

    return response.data;
  }

  async handleEvent(event: any) {
    const { externalUserId } = event;

    const where: FindOptionsWhere<User> = {
      id: externalUserId,
    };

    const data: GetOne<any> = {
      filter: where,
    };

    const user: User = await this.userRepository.getOne(data);

    if (!user) {
      throw new ByIdNotFoundException(User, externalUserId);
    }

    const payload = getApplicantStatus(event);

    if (payload?.applicantStatus) {
      if (
        user.applicantStatus !== payload.applicantStatus ||
        (user.applicantStatus === payload.applicantStatus &&
          user.rejectionReason &&
          payload.rejectionReason &&
          user.rejectionReason !== payload.rejectionReason)
      ) {
        const update: DeepPartial<User> = payload;

        await this.queue.messagingHub.add('user.update', {
          where,
          update,
        });
      }
    }
  }
}
