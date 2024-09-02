import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Name } from '@libs/enums/queue';

import {SocketGateway} from "@libs/socket";
import {SocketEvent} from "@libs/interfaces/socket";

@Processor(Name.MessagingHub)
export class SocketListener {
    constructor(private readonly socketGateway: SocketGateway) {}

    @Process('socket.emit')
    async emit(job: Job) {

        const event: SocketEvent = job.data

        return this.socketGateway.emit(event)
    }
}
