import {Injectable} from '@nestjs/common';
import {JwtService, JwtSignOptions, JwtVerifyOptions} from '@nestjs/jwt';
import {TokenPayload} from "@libs/interfaces/auth";
import {JwtConfigService} from "@libs/config";
import {pick} from "lodash";

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService,
                private readonly config: JwtConfigService) {}

    public decode(token: string): string | { [key: string]: any } {
        return this.jwtService.decode(token);
    }

    public async generateAccessToken(
        payload: string | Record<string, unknown>
    ): Promise<string> {



        const options: JwtSignOptions = {
            expiresIn: this.config.expiresIn,
            secret: this.config.secret
        }

        return await this.jwtService.signAsync(pick(payload, 'id') as string, options);
    }

    public async generateRefreshToken(
        payload: string | Record<string, unknown>
    ): Promise<string> {

        const options: JwtSignOptions = {
            expiresIn: this.config.refreshExpiresIn,
            secret: this.config.refreshSecret
        }

        return await this.jwtService.signAsync(payload as string, options);
    }

    public verifyToken<T extends TokenPayload = any>(token: string): T {

        const options: JwtVerifyOptions = {
            secret: this.config.secret
        }

        return this.jwtService.verify<T>(token, options);
    }

    public verifyRefreshToken<T extends TokenPayload = any>(token: string): T {

        const options: JwtVerifyOptions = {
            secret: this.config.refreshSecret
        }

        return this.jwtService.verify<T>(token, options);
    }
}
