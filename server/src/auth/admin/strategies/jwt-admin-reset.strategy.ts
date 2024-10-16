import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {JwtConfigService} from "@libs/config";
import {TokenPayload} from "@libs/interfaces/auth";

@Injectable()
export class JwtAdminResetStrategy extends PassportStrategy(Strategy, 'jwt-admin-reset') {
    constructor(
        private readonly jwtConfig: JwtConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfig.resetAdminSecret,
        });
    }

    public async validate(payload: TokenPayload): Promise<TokenPayload> {
        return payload;
    }
}
