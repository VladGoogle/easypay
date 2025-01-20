import { Injectable, OnModuleInit } from '@nestjs/common';
import { Stripe } from 'stripe';

import { StripeConfigService } from '@libs/config';
import { PaymentIntent, PaymentMethod } from '@libs/interfaces/stripe';

import * as Buffer from 'buffer';

@Injectable()
export default class StripeService implements OnModuleInit {
  private stripe;

  constructor(private readonly config: StripeConfigService) {}

  onModuleInit() {
    this.stripe = new Stripe(this.config.secret, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createCustomer(email: string, userId: string) {
    try {
      const customers = await this.stripe.customers.list({
        email,
        limit: 1,
      });

      if (!customers.data.length) {
        await this.stripe.customers.create({
          email,
          metadata: {
            userId,
          },
        });
      }
    } catch (e) {
      throw e;
    }
  }

  async createPaymentMethod(data: PaymentMethod) {
    const { iban, customer, email, name, accountId } = data;

    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'sepa_debit',
        sepa_debit: {
          iban,
        },
        billing_details: {
          name,
          email,
        },
      });

      const setupIntent = await this.stripe.setupIntents.create({
        payment_method_types: ['sepa_debit'],
        payment_method: paymentMethod.id,
        customer,
        metadata: {
          accountId,
        },
      });

      await this.stripe.setupIntents.confirm(setupIntent.id, {
        payment_method: paymentMethod.id,
        mandate_data: {
          customer_acceptance: {
            type: 'offline',
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async createPaymentIntent(data: PaymentIntent) {
    const { amount, currency, paymentMethod, transactionId, customerId } = data;

    try {
      await this.stripe.paymentIntents.create({
        amount: amount * 100,
        customer: customerId,
        currency,
        metadata: {
          transactionId,
        },
        payment_method: paymentMethod,
        automatic_payment_methods: {
          enabled: true,
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async confirmPaymentIntent(id: string) {
    try {
      return this.stripe.paymentIntents.confirm(id);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async cancelPaymentIntent(id: string) {
    try {
      return this.stripe.paymentIntents.cancel(id);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async constructEventFromPayload(signature: string, payload: Buffer) {
    try {
      const webhookSecret = this.config.webhookSecret;

      return await this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (e) {
      throw e;
    }
  }
}
