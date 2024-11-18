import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { PaymentAccount, Transaction, User } from '@libs/entities';
import { QueueClientService } from '@libs/queue-client';
import objectContaining = jasmine.objectContaining;

@Injectable()
export class StripeWebhookService {
  constructor(private readonly queue: QueueClientService) {}

  async handle(event: Stripe.Event) {
    const { object } = event.data as any;

    switch (event.type) {
      case 'customer.created':
        const where: FindOptionsWhere<User> = {
          id: object.metadata.userId as string,
        };

        const updateUser: Partial<User> = {
          stripeCustomerId: object.id,
        };

        await this.queue.messagingHub.add('user.update', {
          where,
          update: updateUser,
        });

        break;

      case 'setup_intent.succeeded':
        const updatePayment: DeepPartial<PaymentAccount> = {
          stripeSetupIntentId: object.id as string,
          stripePaymentMethodId: object.payment_method as string,
        };

        await this.queue.messagingHub.add('account.update', {
          id: object.metadata.accountId as string,
          update: updatePayment,
        });

        break;

      case 'payment_intent.created':
        const updateTransaction: DeepPartial<Transaction> = {
          stripePaymentIntentId: object.id as string,
        };

        await this.queue.messagingHub.add('transaction.update', {
          id: object.metadata.transactionId as string,
          update: updateTransaction,
        });

        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
