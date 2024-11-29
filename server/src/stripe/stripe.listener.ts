import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { Name } from '@libs/enums/queue';

import StripeService from './stripe.service';

@Processor(Name.MessagingHub)
export class StripeListener {
  constructor(private readonly stripeService: StripeService) {}

  @Process('stripe.customer.create')
  async createCustomer(job: Job) {
    const { email, id } = job.data;

    return this.stripeService.createCustomer(email, id);
  }

  @Process('stripe.payment-method.create')
  async createPaymentMethod(job: Job) {
    return this.stripeService.createPaymentMethod(job.data);
  }

  @Process('stripe.payment-intent.create')
  async createPaymentIntent(job: Job) {
    return this.stripeService.createPaymentIntent(job.data);
  }

  @Process('stripe.payment-intent.confirm')
  async confirmPaymentIntent(job: Job) {
    const { id } = job.data;

    return this.stripeService.confirmPaymentIntent(id);
  }

  @Process('stripe.payment-intent.cancel')
  async cancelPaymentIntent(job: Job) {
    const { id } = job.data;

    return this.stripeService.cancelPaymentIntent(id);
  }
}
