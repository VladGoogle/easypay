import {Body, Controller, Get, Headers, HttpCode, Post, Req, UseGuards} from '@nestjs/common';
import {LoginDTO} from "./dto";
import {AuthResult} from "./interfaces";
import {AuthService} from "./auth.service";
import {JwtAccessGuard, JwtRefreshGuard} from "@libs/guards/jwt";
import {GoogleOauthGuard} from "@libs/guards/oauth";

@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService) {}

    @Post('login')
    @HttpCode(200)
    public login(@Body() loginDto: LoginDTO): Promise<AuthResult> {
        return this.service.login(loginDto);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    @HttpCode(200)
    public refresh(@Headers() headers: any): Promise<Pick<AuthResult, 'accessToken'>> {

        const {authorization} = headers

        return this.service.refreshAccessToken(authorization);
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
