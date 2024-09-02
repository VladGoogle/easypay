import {Injectable, OnModuleInit} from '@nestjs/common';
import Stripe from 'stripe';
import {FindOptionsWhere} from "typeorm";

import {User} from "@libs/entities";
import { StripeConfigService } from '@libs/config';
import { QueueClientService } from '@libs/queue-client';

@Injectable()
export default class StripeService implements OnModuleInit {
    private stripe

    constructor(
        private readonly config: StripeConfigService,
        private readonly queue: QueueClientService,
    ) {}

    onModuleInit() {
        this.stripe = new Stripe(this.config.secret, {
            apiVersion: '2024-06-20',
        });
    }

    async createCustomer(email: string, userId: string) {
        try {
            const customers = await this.stripe.customers.list({
                email,
                limit: 1
            })

            if(!customers.data.length) {
                const customer = await this.stripe.customers.create({
                    email,
                });

                const where: FindOptionsWhere<User> = {
                    id: userId
                }

                const update: Partial<User> = {
                    stripeCustomerId: customer.id
                }

                return await this.queue.messagingHub.add('user.update', {
                    where,
                    update
                });
            }
        } catch (e) {
            throw e
        }
    }

}
