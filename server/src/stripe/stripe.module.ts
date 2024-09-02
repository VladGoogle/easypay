import { Module } from '@nestjs/common';

import {StripeConfigModule} from "@libs/config";

import {StripeListener} from "./stripe.listener";
import StripeService from "./stripe.service";

@Module({
    imports: [StripeConfigModule],
    providers: [StripeListener, StripeService],
    exports: [StripeListener]
})
export class StripeModule {}
