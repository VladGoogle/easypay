import { Module } from '@nestjs/common';

import {JwtAuthModule} from "@libs/auth";
import {GoogleOauthConfigModule, JwtConfigModule} from "@libs/config";

import {AdminAuthController, AdminAuthService} from "./admin";
import {JwtAdminAccessStrategy, JwtAdminRefreshStrategy} from "./admin/strategies";
import { AuthController } from './auth.controller';
import {AuthService} from "./auth.service";
import {GoogleOauthStrategy, JwtAccessStrategy, JwtRefreshStrategy} from "./strategies";
import {UsersModule} from "../users";
import {AdminModule} from "../admin";


@Module({
  imports: [
    AdminModule,
    GoogleOauthConfigModule,
    JwtAuthModule,
    JwtConfigModule,
    UsersModule
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [
    AdminAuthService,
    AuthService,
    GoogleOauthStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAdminAccessStrategy,
    JwtAdminRefreshStrategy
  ],
})
export class AuthModule {}
