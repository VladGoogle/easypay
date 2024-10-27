import {Module} from "@nestjs/common";

import {JwtAuthModule} from "@libs/auth";
import {JwtConfigModule, TwoFactorConfigModule} from "@libs/config";
import {QueueClientModule} from "@libs/queue-client";

import {TwoFactorAuthenticationController} from "./two-factor.controller";
import {TwoFactorAuthenticationService} from "./two-factor.service";

@Module({
  imports: [
    JwtAuthModule,
    JwtConfigModule,
    QueueClientModule,
    TwoFactorConfigModule,
  ],
  providers: [TwoFactorAuthenticationService],
  controllers: [TwoFactorAuthenticationController]
})
export class TwoFactorAuthenticationModule {}
