import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtConfigService } from '@libs/config';
import { TwoFactorTokenPayloadInterface } from '@libs/interfaces/auth';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-2fa-access',
) {
  constructor(private readonly jwtConfig: JwtConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  public async validate(
    payload: TwoFactorTokenPayloadInterface,
  ): Promise<TwoFactorTokenPayloadInterface | void> {
    if (!payload.isTwoFactorAuthenticationEnabled) {
      return payload;
    }

    if (payload?.isSecondFactorAuthenticated) {
      return payload;
    }
  }
}
