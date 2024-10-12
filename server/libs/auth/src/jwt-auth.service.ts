import {Injectable} from '@nestjs/common';
import {JwtService, JwtSignOptions, JwtVerifyOptions} from '@nestjs/jwt';
import {TokenData, TokenPayload, VerifyToken} from "@libs/interfaces/auth";
import {pick} from "lodash";

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) {}

    public decode(token: string): string | { [key: string]: any } {
        return this.jwtService.decode(token);
    }

    public async generateToken(data: TokenData<any>): Promise<string> {

        let {payload, secret, expiresIn} = data

        const options: JwtSignOptions = {
            expiresIn,
            secret
        }

        payload = pick(payload, 'id') as unknown as string

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
