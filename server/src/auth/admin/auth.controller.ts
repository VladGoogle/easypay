import {Body, Controller, Get, HttpCode, Post, Req, UseGuards} from '@nestjs/common';

import {JwtAdminAccessGuard, JwtAdminRefreshGuard, JwtAdminResetGuard} from "@libs/guards/jwt";
import {AuthRequest} from "@libs/interfaces/auth";

import {AdminAuthService} from "./auth.service";
import {AdminLoginDTO} from "./dto";
import {ForgotPasswordDTO, ResetPasswordDTO, UpdatePasswordDTO} from "../dto";
import {AuthResult} from "../interfaces";

@Controller('admin/auth')
export class AdminAuthController {

    constructor(private readonly service: AdminAuthService) {}

    @Post('login')
    @HttpCode(200)
    public login(@Body() loginDto: AdminLoginDTO): Promise<AuthResult> {
        return this.service.login(loginDto);
    }

    @Post('change-password')
    @HttpCode(200)
    @UseGuards(JwtAdminAccessGuard)
    public async changePassword(
        @Body() dto: UpdatePasswordDTO,
        @Req() { user }: AuthRequest,
    ): Promise<string> {
        return this.service.changePassword(dto, user);
    }

    @Post('forgot-password')
    @HttpCode(200)
    public async forgotPassword(
        @Body() dto: ForgotPasswordDTO,
    ): Promise<string> {
        return this.service.forgotPassword(dto.email);
    }

    @UseGuards(JwtAdminResetGuard)
    @Post('reset-password')
    @HttpCode(200)
    public async resetPassword(
        @Body() dto: ResetPasswordDTO,
        @Req() {user}: AuthRequest
    ): Promise<string> {
        return this.service.resetPassword(dto, user);
    }

    @UseGuards(JwtAdminRefreshGuard)
    @Get('refresh')
    @HttpCode(200)
    public refresh(
        @Req() {user}: AuthRequest
    ): Promise<Pick<AuthResult, 'accessToken'>> {
        return this.service.refreshAccessToken(user);
    }

}
