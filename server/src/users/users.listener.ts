import {Inject} from "@nestjs/common";
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { Name } from '@libs/enums/queue';
import {RepositoryInterface} from "@libs/interfaces/repository";
import {SocketEvent} from "@libs/interfaces/socket";
import {QueueClientService} from "@libs/queue-client";

import {USER_INTERFACE_TOKEN} from "./constants";

@Processor(Name.MessagingHub)
export class UserListener {
    constructor(@Inject(USER_INTERFACE_TOKEN) private readonly repository: RepositoryInterface,
                private readonly queue: QueueClientService) {}

    @Process('user.update')
    async update(job: Job) {
        const {where, update} = job.data

        const res = await this.repository.update(where, update);

        if(res && (update.rejectionReason || update.rejectionStatus)) {

            const event: SocketEvent = {
                name: 'applicantStatusUpdated',
                userId: where.id,
                payload: update
            }

            await this.queue.messagingHub.add('socket.emit', {
                event
            })
        }
    }


}
