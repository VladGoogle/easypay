import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtConfigService } from '@libs/config';
import {TokenPayload} from "@libs/interfaces/auth";

@Injectable()
export class JwtAdminAccessStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    private readonly jwtConfig: JwtConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.adminSecret,
    });
  }

  public validate(payload: any): Promise<TokenPayload> {
    return payload
  }
}
