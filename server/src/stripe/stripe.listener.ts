import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { Name } from '@libs/enums/queue';

import StripeService from "./stripe.service";

@Processor(Name.MessagingHub)
export class StripeListener {
    constructor(private readonly stripeService: StripeService) {}

    @Process('stripe.customer.create')
    async createCustomer(job: Job) {
        const {email, id} = job.data

        return this.stripeService.createCustomer(email, id)
    }


}
