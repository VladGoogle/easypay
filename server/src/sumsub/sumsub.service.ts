import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import axios from "axios";
import {SumsubConfigService} from "@libs/config";
import * as crypto from "node:crypto";
import {USER_INTERFACE_TOKEN} from "../users/constants";
import {RepositoryInterface} from "@libs/interfaces/repository";
import {FindOptionsWhere} from "typeorm";
import {User} from "@libs/entities";
import {getApplicantStatus} from "./utils/utils";
import {QueueClientService} from "@libs/queue-client";
import {application} from "express";
import {ByIdNotFoundException} from "@libs/exceptions";

@Injectable()
export class SumsubService {

    constructor(
        @Inject(USER_INTERFACE_TOKEN) private readonly userRepository: RepositoryInterface,
        private readonly config: SumsubConfigService,
        private readonly queue: QueueClientService) {
    }

    async startKycFlow(userId: string) {

        const stamp = Math.floor(Date.now() / 1000).toString()

        const url = '/resources/applicants?levelName=basic-kyc-level'

        let valueToSign = stamp + 'POST' + url;

        const data = {
            externalUserId: userId,
        }

        valueToSign += JSON.stringify(data);

        const signature = crypto.createHmac('sha256', this.config.secret)
            .update(valueToSign)
            .digest('hex');


        try {
            const response = await axios.post('https://api.sumsub.com/resources/applicants', {
                externalUserId: userId,
            }, {
                headers: {
                    'X-App-Token': this.config.token,
                    'X-App-Access-Ts': stamp,
                    'X-App-Access-Sig': signature,
                    'Content-Type': 'application/json',
                },
                params: {
                    levelName: 'basic-kyc-level'
                }
            });

            return response.data
        } catch (e: any) {
            console.error('Error Response:', e.response ? e.response.data : e.message);
            throw e;
        }
    };

    async handleEvent(event: any) {

        const {externalUserId} = event

        const where: FindOptionsWhere<User> = {
            id: externalUserId
        }

        const user: User = await this.userRepository.getOne(where)

        if(!user) {
            throw new ByIdNotFoundException(User, externalUserId)
        }

        const payload = getApplicantStatus(event)

        if(payload?.applicantStatus) {

            if((user.applicantStatus !== payload.applicantStatus) || (
                (user.applicantStatus === payload.applicantStatus)
                && (user.rejectionReason && payload.rejectionReason)
                && (user.rejectionReason !== payload.rejectionReason)
            )
            ) {
                const update: Partial<User> = payload

                await this.queue.messagingHub.add('user.update', {
                    where,
                    update
                })
            }
        }
    }
}
