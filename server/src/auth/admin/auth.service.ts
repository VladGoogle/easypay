import {BadRequestException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {compare, hash} from "bcrypt";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {Admin} from "@libs/entities";
import {TokenData, TokenPayload} from "@libs/interfaces/auth";
import { JwtAuthService } from '@libs/auth';
import {JwtConfigService} from "@libs/config";
import {AuthResult} from "../interfaces";
import {AdminLoginDTO} from "./dto";
import {ADMIN_REPOSITORY_TOKEN} from "@libs/constants";
import {UpdatePasswordDTO} from "../dto";
import {UserData} from "@libs/interfaces/user";


@Injectable()
export class AdminAuthService {

    constructor(@Inject(ADMIN_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface,
                private readonly jwtService: JwtAuthService,
                private readonly config: JwtConfigService) {}

    public async login(dto: AdminLoginDTO): Promise<AuthResult> {

        const {password ,email} = dto

        const where: FindOptionsWhere<Admin> = {email};

        const data: GetOne<FindOptionsWhere<Admin>> = {
            filter: where,
            select: ['password']
        }

        const admin: Admin = await this.repository.getOne(data)

        if(!admin) {
            throw new UnauthorizedException('No dto found');
        }

        if (!(await compare(password, admin.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return await this.generateTokens(admin);
    }

    private async generateTokens(admin: Admin): Promise<AuthResult> {
        const payload: Partial<TokenPayload> = {
            id: admin.id
        };

        const accessTokenPayload: TokenData<Partial<UserData>> = {
            payload,
            expiresIn: this.config.expiresIn,
            secret: this.config.adminSecret
        }

        const refreshTokenPayload: TokenData<Partial<UserData>> = {
            payload,
            expiresIn: this.config.refreshExpiresIn,
            secret: this.config.adminRefreshSecret
        }

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.generateToken(accessTokenPayload),
            this.jwtService.generateToken(refreshTokenPayload),
        ])

        return { accessToken, refreshToken };
    }

    public async refreshAccessToken(params: UserData): Promise<Pick<AuthResult, 'accessToken'>> {

        const generateTokenData: TokenData<UserData> = {
            payload: params,
            secret: this.config.adminSecret,
            expiresIn: this.config.expiresIn
        }

        const accessToken = await this.jwtService.generateToken(generateTokenData)

        return { accessToken };
    }

    public async changePassword(dto: UpdatePasswordDTO, params: UserData): Promise<string> {

        const filter: FindOptionsWhere<Admin> = {
            id: params.id
        }

        const getOnePayload: GetOne<any> = {
            filter,
            select: ['password']
        }

        const user: Admin = await this.repository.getOne(getOnePayload)

        if(!await compare(dto.currentPassword, user.password)) {
            throw new BadRequestException('The Current Password is incorrect');
        }

        const password = await hash(dto.newPassword, 10);

        const update: DeepPartial<Admin> = {
            password
        }

        await this.repository.update(filter, update)

        return 'Password updated successfully'
    }

}
