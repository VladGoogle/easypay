import {BadRequestException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';

import {ResetPasswordDTO, UpdatePasswordDTO, UserLoginDTO} from "./dto";
import {AuthResult} from "./interfaces";
import {compare, hash} from "bcrypt";
import {USER_REPOSITORY_TOKEN} from "../users/constants";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {User} from "@libs/entities";
import {TokenData, TokenPayload} from "@libs/interfaces/auth";
import { JwtAuthService } from '@libs/auth';
import {AppConfigService, JwtConfigService} from "@libs/config";
import {UserData} from "@libs/interfaces/user";
import {ByEmailNotFoundException} from "@libs/exceptions";
import {QueueClientService} from "@libs/queue-client";
import {SendMail, Variable} from "@libs/interfaces/mailer";


@Injectable()
export class AuthService {

    constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface,
                private readonly appConfig: AppConfigService,
                private readonly jwtService: JwtAuthService,
                private readonly jwtConfig: JwtConfigService,
                private readonly queue: QueueClientService,
    ) {
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
            id: user.id,
            email: user.email
        };

        const accessTokenPayload: TokenData<Partial<UserData>> = {
            payload,
            expiresIn: this.jwtConfig.expiresIn,
            secret: this.jwtConfig.secret
        }

        const refreshTokenPayload: TokenData<Partial<UserData>> = {
            payload,
            expiresIn: this.jwtConfig.refreshExpiresIn,
            secret: this.jwtConfig.refreshSecret
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
            secret: this.jwtConfig.adminSecret,
            expiresIn: this.jwtConfig.expiresIn
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

    public async forgotPassword(email: string): Promise<string> {
        const payload: FindOptionsWhere<User> = {
            email
        }

        const data: GetOne<FindOptionsWhere<User>> = {
            filter: payload
        }

        const user: User = await this.repository.getOne(data)

        if (!user) {
            throw new ByEmailNotFoundException(User, email);
        }

        const tokenPayload: TokenData<any> = {
            payload,
            secret: this.jwtConfig.resetSecret,
            expiresIn: this.jwtConfig.resetExpiresIn
        }

        const token = await this.jwtService.generateToken(tokenPayload);

        const link = `http://${this.appConfig.host}:${this.appConfig.frontendPort}/reset-password?token=${token}`

        const vars: Variable[] = [];

        vars.push(
            {
                name: 'name',
                content: user.fullName,
            },
            {
                name: 'link',
                content: link
            },
            {
                name: 'expiryHours',
                content: 1
            }
        )

        const template = 'reset-password';

        const subject = 'Link for restoring your password'

        const jobPayload: SendMail = {
            to: email,
            subject,
            template,
            variables: vars
        }

        await this.queue.mail.add('send.template', jobPayload)

        return 'You will receive an email with link for restoring your password'
    }

    public async resetPassword(dto: ResetPasswordDTO, params: UserData): Promise<string> {

        const {email} = params

        if(dto.newPassword !== dto.repeatedPassword) {
            throw new BadRequestException('New and repeated passwords are not the same')
        }

        const filter: FindOptionsWhere<User> = {
            email
        }

        const password = await hash(dto.newPassword, 10);

        const update: DeepPartial<User> = {
            password
        }

        await this.repository.update(filter, update)

        return 'Password updated successfully'
    }

}
