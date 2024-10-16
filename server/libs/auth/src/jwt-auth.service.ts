import {Injectable} from '@nestjs/common';
import {JwtService, JwtSignOptions, JwtVerifyOptions} from '@nestjs/jwt';

import {TokenData, TokenPayload, VerifyToken} from "@libs/interfaces/auth";

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) {}

    public async generateToken(data: TokenData<any>): Promise<string> {

        let {payload, secret, expiresIn} = data

        const options: JwtSignOptions = {
            expiresIn,
            secret
        }

        return await this.jwtService.signAsync(payload, options);
    }

    public verifyToken<T extends TokenPayload = any>(data: VerifyToken): T {

        const {token, secret} = data

        const options: JwtVerifyOptions = {
            secret
        }

        return this.jwtService.verify<T>(token, options);
    }
}
