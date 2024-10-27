import {
    Controller,
    Post,
    Res,
    UseGuards,
    Req, Get, Body,
} from '@nestjs/common';
import { Response } from 'express';
import {DeepPartial, FindOptionsWhere} from "typeorm";

import {JwtAuthService} from "@libs/auth";
import {JwtConfigService} from "@libs/config";
import {User} from "@libs/entities";
import {JwtAccessGuard} from "@libs/guards/jwt";
import {AuthRequest, TokenData, TwoFactorTokenPayloadInterface} from "@libs/interfaces/auth";
import {QueueClientService} from "@libs/queue-client";

import {TwoFactorAuthenticationCodeDTO} from "./dto";
import {TwoFactorAuthenticationService} from "./two-factor.service";
import {omit} from "lodash";

@Controller('2fa')
export class TwoFactorAuthenticationController {
    constructor(
        private readonly jwtConfig: JwtConfigService,
        private readonly jwtService: JwtAuthService,
        private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
        private readonly queue: QueueClientService
    ) {}

    @Get('generate')
    @UseGuards(JwtAccessGuard)
    async generateQrCode(
        @Res() response: Response,
        @Req() {user}: AuthRequest
    ) {
        return await this.twoFactorAuthenticationService.pipeQrCodeStream(response, user);
    }

    @Post('turn-on')
    @UseGuards(JwtAccessGuard)
    async turnOnTwoFactorAuthentication(
        @Req() {user}: AuthRequest,
        @Body() dto : TwoFactorAuthenticationCodeDTO
    ) {
        this.twoFactorAuthenticationService.verifyCode(dto.code, user);

        const where: FindOptionsWhere<User> = {
            id: user.id
        }

        const update: DeepPartial<User> = {
            isTwoFactorAuthenticationEnabled: true
        }

        await this.queue.messagingHub.add('user.update', {
            where,
            update
        })
    }

    @Post('authenticate')
    @UseGuards(JwtAccessGuard)
    async authenticate(
        @Req() {user}: AuthRequest,
        @Body() dto : TwoFactorAuthenticationCodeDTO
    ) {
        this.twoFactorAuthenticationService.verifyCode(dto.code, user);

        const payload: TwoFactorTokenPayloadInterface= {
            ...omit(user, ['iat', 'exp']),
            isSecondFactorAuthenticated: true
        }

        const accessTokenPayload: TokenData<TwoFactorTokenPayloadInterface> = {
            payload,
            expiresIn: this.jwtConfig.expiresIn,
            secret: this.jwtConfig.secret
        }

        const refreshTokenPayload: TokenData<TwoFactorTokenPayloadInterface> = {
            payload,
            expiresIn: this.jwtConfig.refreshExpiresIn,
            secret: this.jwtConfig.refreshSecret
        }

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.generateToken(accessTokenPayload),
            this.jwtService.generateToken(refreshTokenPayload),
        ])

        return {accessToken, refreshToken};
    }
}