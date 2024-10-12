import {Body, Controller, Get, HttpCode, Post, Req, UseGuards} from '@nestjs/common';

import {JwtAccessGuard, JwtRefreshGuard} from "@libs/guards/jwt";
import {GoogleOauthGuard} from "@libs/guards/oauth";

import {AuthService} from "./auth.service";
import {UpdatePasswordDTO, UserLoginDTO} from "./dto";
import {AuthResult} from "./interfaces";
import {AuthRequest} from "@libs/interfaces/auth";

@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService) {}

    @Post('login')
    @HttpCode(200)
    public login(@Body() loginDto: UserLoginDTO): Promise<AuthResult> {
        return this.service.login(loginDto);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    @HttpCode(200)
    public refresh(
        @Req() {user}: AuthRequest
    ): Promise<Pick<AuthResult, 'accessToken'>> {
        return this.service.refreshAccessToken(user);
    }

    @Post('change-password')
    @HttpCode(200)
    @UseGuards(JwtAccessGuard)
    public async changePassword(
        @Body() dto: UpdatePasswordDTO,
        @Req() { user }: AuthRequest,
    ): Promise<string> {
        return this.service.changePassword(dto, user);
    }

    @Get('google-redirect')
    @UseGuards(GoogleOauthGuard)
    googleAuthRedirect(@Req() req: any) {
        if (!req.user) {
            return 'No user from google';
        }

        return {
            message: 'User information from google',
            user: req.user,
        };
    }

}
