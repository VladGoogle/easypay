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
  JwtAdminAccessGuard,
  JwtAdminRefreshGuard,
  JwtAdminResetGuard,
} from '@libs/guards/jwt';
import { AuthRequest } from '@libs/interfaces/auth';

import { AdminAuthService } from './auth.service';
import { AdminLoginDTO } from './dto';
import {
  ForgotPasswordDTO,
  LoginResponseDTO,
  RefreshTokenResponseDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
} from '../dto';
import { AuthResult } from '../interfaces';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin Authentication endpoints')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly service: AdminAuthService) {}

  @Post('login')
  @ApiBody({ type: AdminLoginDTO, required: true })
  @ApiOkResponse({
    description: 'The response with access and refresh tokens',
    type: LoginResponseDTO,
  })
  public login(@Body() loginDto: AdminLoginDTO): Promise<AuthResult> {
    return this.service.login(loginDto);
  }

  @Post('change-password')
  @HttpCode(200)
  @UseGuards(JwtAdminAccessGuard)
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
    return this.service.changePassword(dto, user);
  }

  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDTO, required: true })
  @ApiOkResponse({
    description:
      'Message indication, that the email for restoring password has been sent',
    example: 'You will receive an email with link for restoring your password',
  })
  public async forgotPassword(@Body() dto: ForgotPasswordDTO): Promise<string> {
    return this.service.forgotPassword(dto.email);
  }

  @UseGuards(JwtAdminResetGuard)
  @Post('reset-password')
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
    return this.service.resetPassword(dto, user);
  }

  @UseGuards(JwtAdminRefreshGuard)
  @Get('refresh')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The response with refreshed access token',
    type: RefreshTokenResponseDTO,
  })
  public refresh(
    @Req() { user }: AuthRequest,
  ): Promise<Pick<AuthResult, 'accessToken'>> {
    return this.service.refreshAccessToken(user);
  }
}
