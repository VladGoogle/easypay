import {BadRequestException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';

import {LoginDTO} from "./dto";
import {AuthResult} from "./interfaces";
import {compare} from "bcrypt";
import {USER_INTERFACE_TOKEN} from "../users/constants";
import {RepositoryInterface} from "@libs/interfaces/repository";
import {FindOptionsWhere} from "typeorm";
import {User} from "@libs/entities";
import {TokenPayload} from "@libs/interfaces/auth";
import { JwtAuthService } from '@libs/auth';


@Injectable()
export class AuthService {

    constructor(@Inject(USER_INTERFACE_TOKEN) private readonly repository: RepositoryInterface,
                private readonly jwtService: JwtAuthService) {}

    public async login(dto: LoginDTO): Promise<AuthResult> {

        const {password} = dto

        if((dto.email && dto.phone) || (!dto.email && !dto.phone)) {
            throw new BadRequestException('Either email or phone should be provided for login payload')
        }

        const where: FindOptionsWhere<User> = {};

        if(dto.email) {
            where.email = dto.email
        }

        if(dto.phone) {
            where.phone = dto.phone
        }

        const user: User = await this.repository.getOne(where)

        if(!user) {
            throw new UnauthorizedException('No user found');
        }

        if (!(await compare(password, user.password))) {
            throw new UnauthorizedException('Wrong password');
        }

        return await this.generateTokens(user);
    }

    private async generateTokens(user: User): Promise<AuthResult> {
        const payload: Partial<TokenPayload> = {
            id: user.id
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.generateAccessToken(payload),
            this.jwtService.generateRefreshToken(payload),
        ])

        return { accessToken, refreshToken };
    }

    public async refreshAccessToken(token: string): Promise<Pick<AuthResult, 'accessToken'>> {

        let refresh;

        try {
            refresh = await this.jwtService.verifyRefreshToken(token.replace('Bearer ', '').trim())
        } catch (e) {
            throw new UnauthorizedException('Refresh token is invalid')
        }

        const accessToken = await this.jwtService.generateAccessToken(refresh)

        return { accessToken };
    }

}
