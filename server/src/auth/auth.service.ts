import {BadRequestException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';

import {UpdatePasswordDTO, UserLoginDTO} from "./dto";
import {AuthResult} from "./interfaces";
import {compare, hash} from "bcrypt";
import {USER_REPOSITORY_TOKEN} from "../users/constants";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {User} from "@libs/entities";
import {TokenData, TokenPayload} from "@libs/interfaces/auth";
import { JwtAuthService } from '@libs/auth';
import {JwtConfigService} from "@libs/config";
import {UserData} from "@libs/interfaces/user";


@Injectable()
export class AuthService {

    constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface,
                private readonly jwtService: JwtAuthService,
                private readonly config: JwtConfigService) {
    }

    public async login(dto: UserLoginDTO): Promise<AuthResult> {

        const {password} = dto

        if ((dto.email && dto.phone) || (!dto.email && !dto.phone)) {
            throw new BadRequestException('Either email or phone should be provided for login payload')
        }

        const where: FindOptionsWhere<User> = {};

        if (dto?.email) {
            where.email = dto.email
        }

        if (dto?.phone) {
            where.phone = dto.phone
        }

        const data: GetOne<any> = {
            filter: where,
            select: ['password']
        }

        const user: User = await this.repository.getOne(data)

        if (!user) {
            throw new UnauthorizedException('No user found');
        }

        if (!(await compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return await this.generateTokens(user);
    }

    private async generateTokens(user: User): Promise<AuthResult> {
        const payload: Partial<TokenPayload> = {
            id: user.id
        };

        const accessTokenPayload: TokenData<Partial<UserData>> = {
            payload,
            expiresIn: this.config.expiresIn,
            secret: this.config.secret
        }

        const refreshTokenPayload: TokenData<Partial<UserData>> = {
            payload,
            expiresIn: this.config.refreshExpiresIn,
            secret: this.config.refreshSecret
        }

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.generateToken(accessTokenPayload),
            this.jwtService.generateToken(refreshTokenPayload),
        ])

        return {accessToken, refreshToken};
    }

    public async refreshAccessToken(params: UserData): Promise<Pick<AuthResult, 'accessToken'>> {

        const generateTokenData: TokenData<UserData> = {
            payload: params,
            secret: this.config.adminSecret,
            expiresIn: this.config.expiresIn
        }

        const accessToken = await this.jwtService.generateToken(generateTokenData)

        return {accessToken};
    }

    public async changePassword(dto: UpdatePasswordDTO, params: UserData): Promise<string> {

        const filter: FindOptionsWhere<User> = {
            id: params.id
        }

        const getOnePayload: GetOne<any> = {
            filter,
            select: ['password']
        }

        const user: User = await this.repository.getOne(getOnePayload)

        if(!await compare(dto.currentPassword, user.password)) {
            throw new BadRequestException('The Current Password is incorrect');
        }

        const password = await hash(dto.newPassword, 10);

        const update: DeepPartial<User> = {
            password
        }

        await this.repository.update(filter, update)

        return 'Password updated successfully'
    }

}
