import { Module } from '@nestjs/common';

import {JwtAuthModule} from "@libs/auth";
import {AppConfigModule, GoogleOauthConfigModule, JwtConfigModule} from "@libs/config";
import {FirebaseModule} from "@libs/firebase";
import {QueueClientModule} from "@libs/queue-client";

import {AdminModule} from "../admin";
import {AdminAuthController, AdminAuthService} from "./admin";
import {JwtAdminAccessStrategy, JwtAdminRefreshStrategy, JwtAdminResetStrategy} from "./admin/strategies";
import { AuthController } from './auth.controller';
import {AuthService} from "./auth.service";
import {
  GoogleOauthStrategy,
  JwtAccessStrategy,
  JwtRefreshStrategy,
  JwtResetStrategy,
  JwtTwoFactorStrategy
} from "./strategies";
import {UsersModule} from "../users";


@Module({
  imports: [
    AdminModule,
    AppConfigModule,
    FirebaseModule,
    GoogleOauthConfigModule,
    JwtAuthModule,
    JwtConfigModule,
    QueueClientModule,
    UsersModule
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [
    AdminAuthService,
    AuthService,
    GoogleOauthStrategy,
    JwtTwoFactorStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAdminAccessStrategy,
    JwtAdminRefreshStrategy,
    JwtAdminResetStrategy,
    JwtResetStrategy,
  ],
})
export class AuthModule {}
