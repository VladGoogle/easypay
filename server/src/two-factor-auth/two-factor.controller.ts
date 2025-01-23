import {
  Controller,
  Post,
  Res,
  UseGuards,
  Req,
  Get,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

import { JwtAuthService } from '@libs/auth';
import { JwtConfigService } from '@libs/config';
import { User } from '@libs/entities';
import { JwtAccessGuard } from '@libs/guards/jwt';
import {
  AuthRequest,
  TokenData,
  TwoFactorTokenPayloadInterface,
} from '@libs/interfaces/auth';
import { QueueClientService } from '@libs/queue-client';

import { TwoFactorAuthenticationCodeDTO } from './dto';
import { TwoFactorAuthenticationService } from './two-factor.service';
import { omit } from 'lodash';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDTO } from '../auth/dto';

@ApiTags('User endpoints')
@Controller('2fa')
@ApiBearerAuth()
export class TwoFactorAuthenticationController {
  constructor(
    private readonly jwtConfig: JwtConfigService,
    private readonly jwtService: JwtAuthService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly queue: QueueClientService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Get('generate')
  @ApiOkResponse({
    description: 'Returns QR code for the Authenticator',
  })
  async generateQrCode(
    @Res() response: Response,
    @Req() { user }: AuthRequest,
  ) {
    return await this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      user,
    );
  }

  @Post('turn-on')
  @UseGuards(JwtAccessGuard)
  @ApiBody({ type: TwoFactorAuthenticationCodeDTO, required: true })
  @ApiOkResponse()
  async turnOnTwoFactorAuthentication(
    @Req() { user }: AuthRequest,
    @Body() dto: TwoFactorAuthenticationCodeDTO,
  ) {
    this.twoFactorAuthenticationService.verifyCode(dto.code, user);

    const where: FindOptionsWhere<User> = {
      id: user.id,
    };

    const update: DeepPartial<User> = {
      isTwoFactorAuthenticationEnabled: true,
    };

    await this.queue.messagingHub.add('user.update', {
      where,
      update,
    });
  }

  @Post('authenticate')
  @UseGuards(JwtAccessGuard)
  @ApiBody({ type: TwoFactorAuthenticationCodeDTO, required: true })
  @ApiOkResponse({
    description: 'The response with access and refresh tokens',
    type: LoginResponseDTO,
  })
  async authenticate(
    @Req() { user }: AuthRequest,
    @Body() dto: TwoFactorAuthenticationCodeDTO,
  ): Promise<LoginResponseDTO> {
    this.twoFactorAuthenticationService.verifyCode(dto.code, user);

    const payload: TwoFactorTokenPayloadInterface = {
      ...omit(user, ['iat', 'exp']),
      isSecondFactorAuthenticated: true,
    };

    const accessTokenPayload: TokenData<TwoFactorTokenPayloadInterface> = {
      payload,
      expiresIn: this.jwtConfig.expiresIn,
      secret: this.jwtConfig.secret,
    };

    const refreshTokenPayload: TokenData<TwoFactorTokenPayloadInterface> = {
      payload,
      expiresIn: this.jwtConfig.refreshExpiresIn,
      secret: this.jwtConfig.refreshSecret,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateToken(accessTokenPayload),
      this.jwtService.generateToken(refreshTokenPayload),
    ]);

    return { accessToken, refreshToken };
  }
}
