import {BadRequestException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {compare, hash} from "bcrypt";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {Admin} from "@libs/entities";
import {TokenData, TokenPayload} from "@libs/interfaces/auth";
import { JwtAuthService } from '@libs/auth';
import {AppConfigService, JwtConfigService} from "@libs/config";
import {AuthResult} from "../interfaces";
import {AdminLoginDTO} from "./dto";
import {ADMIN_REPOSITORY_TOKEN} from "@libs/constants";
import {ResetPasswordDTO, UpdatePasswordDTO} from "../dto";
import {UserData} from "@libs/interfaces/user";
import {ByEmailNotFoundException} from "@libs/exceptions";
import {SendMail, Variable} from "@libs/interfaces/mailer";
import {QueueClientService} from "@libs/queue-client";


@Injectable()
export class AdminAuthService {

    constructor(@Inject(ADMIN_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface,
                private readonly jwtService: JwtAuthService,
                private readonly jwtConfig: JwtConfigService,
                private readonly appConfig: AppConfigService,
                private readonly queue: QueueClientService
    ) {}

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
            id: admin.id,
            email: admin.email
        };

        const accessTokenPayload: TokenData<Partial<UserData>> = {
            payload,
            expiresIn: this.jwtConfig.expiresIn,
            secret: this.jwtConfig.adminSecret
        }

        const refreshTokenPayload: TokenData<Partial<UserData>> = {
            payload,
            expiresIn: this.jwtConfig.refreshExpiresIn,
            secret: this.jwtConfig.adminRefreshSecret
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
            secret: this.jwtConfig.adminSecret,
            expiresIn: this.jwtConfig.expiresIn
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

    public async forgotPassword(email: string): Promise<string> {
        const payload: FindOptionsWhere<Admin> = {
            email
        }

        const data: GetOne<FindOptionsWhere<Admin>> = {
            filter: payload
        }

        const admin: Admin = await this.repository.getOne(data)

        if (!admin) {
            throw new ByEmailNotFoundException(Admin, email);
        }

        const tokenPayload: TokenData<any> = {
            payload,
            secret: this.jwtConfig.resetAdminSecret,
            expiresIn: this.jwtConfig.resetExpiresIn
        }

        const token = await this.jwtService.generateToken(tokenPayload);

        const link = `http://${this.appConfig.host}:${this.appConfig.frontendPort}/admin/reset-password?token=${token}`

        const vars: Variable[] = [];

        vars.push(
            {
                name: 'name',
                content: admin.fullName,
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

        const filter: FindOptionsWhere<Admin> = {
            email
        }

        const password = await hash(dto.newPassword, 10);

        const update: DeepPartial<Admin> = {
            password
        }

        await this.repository.update(filter, update)

        return 'Password updated successfully'
    }

}
