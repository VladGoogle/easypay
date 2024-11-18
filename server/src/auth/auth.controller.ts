import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  Jwt2faAccessGuard,
  JwtRefreshGuard,
  JwtResetGuard,
} from '@libs/guards/jwt';
import { GoogleOauthGuard } from '@libs/guards/oauth';
import { AuthRequest } from '@libs/interfaces/auth';

import { AuthService } from './auth.service';
import {
  FirebaseLoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
  UserLoginDTO,
} from './dto';
import { AuthResult } from './interfaces';

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
  public async refresh(
    @Req() { user }: AuthRequest,
  ): Promise<Pick<AuthResult, 'accessToken'>> {
    return await this.service.refreshAccessToken(user);
  }

  @Post('forgot-password')
  @HttpCode(200)
  public async forgotPassword(@Body() dto: ForgotPasswordDTO): Promise<string> {
    return await this.service.forgotPassword(dto.email);
  }

  @UseGuards(JwtResetGuard)
  @Post('reset-password')
  @HttpCode(200)
  public async resetPassword(
    @Body() dto: ResetPasswordDTO,
    @Req() { user }: AuthRequest,
  ): Promise<string> {
    return await this.service.resetPassword(dto, user);
  }

  @Post('change-password')
  @HttpCode(200)
  @UseGuards(Jwt2faAccessGuard)
  public async changePassword(
    @Body() dto: UpdatePasswordDTO,
    @Req() { user }: AuthRequest,
  ): Promise<string> {
    return await this.service.changePassword(dto, user);
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

  @Post('firebase-login')
  async firebaseLogin(@Body() dto: FirebaseLoginDTO) {
    return await this.service.firebaseLogin(dto);
  }
}
