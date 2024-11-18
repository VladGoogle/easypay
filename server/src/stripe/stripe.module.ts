import { Module } from '@nestjs/common';

import { StripeConfigModule } from '@libs/config';
import { QueueClientModule } from '@libs/queue-client';

import { StripeListener } from './stripe.listener';
import StripeService from './stripe.service';
import { StripeWebhookController, StripeWebhookService } from './webhook';

@Module({
  imports: [StripeConfigModule, QueueClientModule],
  providers: [StripeListener, StripeService, StripeWebhookService],
  exports: [StripeListener],
  controllers: [StripeWebhookController],
})
export class StripeModule {}
