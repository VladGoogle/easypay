import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';

import { RawRequest } from '@libs/interfaces/common';

import StripeService from '../stripe.service';
import { StripeWebhookService } from './stripe-webhook.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly stripeWebhookService: StripeWebhookService,
  ) {}

  @Post('webhook')
  async handle(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawRequest,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody,
    );

    return this.stripeWebhookService.handle(event);
  }
}
