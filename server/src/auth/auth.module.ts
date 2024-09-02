import { Module } from '@nestjs/common';

import {JwtAuthModule} from "@libs/auth";
import {GoogleOauthConfigModule, JwtConfigModule} from "@libs/config";

import { AuthController } from './auth.controller';
import {AuthService} from "./auth.service";
import {GoogleOauthStrategy, JwtAccessStrategy, JwtRefreshStrategy} from "./strategies";
import {UsersModule} from "../users";


@Module({
  imports: [
    GoogleOauthConfigModule,
    JwtAuthModule,
    JwtConfigModule,
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleOauthStrategy, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
