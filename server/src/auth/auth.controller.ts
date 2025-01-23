import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

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
  LoginResponseDTO,
  RefreshTokenResponseDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
  UserLoginDTO,
} from './dto';
import { AuthResult } from './interfaces';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication endpoints')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiBody({ type: UserLoginDTO, required: true })
  @ApiOkResponse({
    description: 'The response with access and refresh tokens',
    type: LoginResponseDTO,
  })
  public login(@Body() loginDto: UserLoginDTO): Promise<AuthResult> {
    return this.service.login(loginDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The response with refreshed access token',
    type: RefreshTokenResponseDTO,
  })
  public async refresh(
    @Req() { user }: AuthRequest,
  ): Promise<Pick<AuthResult, 'accessToken'>> {
    return await this.service.refreshAccessToken(user);
  }

  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDTO, required: true })
  @ApiOkResponse({
    description:
      'Message indication, that the email for restoring password has been sent',
    example: 'You will receive an email with link for restoring your password',
  })
  public async forgotPassword(@Body() dto: ForgotPasswordDTO): Promise<string> {
    return await this.service.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @UseGuards(JwtResetGuard)
  @ApiBearerAuth()
  @ApiBody({ type: ResetPasswordDTO, required: true })
  @ApiOkResponse({
    description:
      'Message indication, that the password has been successfully restored',
    example: 'Password updated successfully',
  })
  public async resetPassword(
    @Body() dto: ResetPasswordDTO,
    @Req() { user }: AuthRequest,
  ): Promise<string> {
    return await this.service.resetPassword(dto, user);
  }

  @Post('change-password')
  @UseGuards(Jwt2faAccessGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePasswordDTO, required: true })
  @ApiOkResponse({
    description: 'The response with access and refresh',
    example: 'Password updated successfully',
  })
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
  @ApiBody({ type: FirebaseLoginDTO, required: true })
  @ApiOkResponse({
    description: 'The response with access and refresh tokens',
    type: LoginResponseDTO,
  })
  async firebaseLogin(@Body() dto: FirebaseLoginDTO) {
    return await this.service.firebaseLogin(dto);
  }
}
