import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtConfigModule, JwtConfigService } from '@libs/config';
import {JwtAuthService} from "@libs/auth/jwt-auth.service";


@Module({
    imports: [
        JwtConfigModule,
        JwtModule.registerAsync({
            imports: [JwtConfigModule],
            useFactory: (config: JwtConfigService) => ({
                secret: config.secret,
                signOptions: {
                    expiresIn:
                    config.expiresIn
                },
            }),
            inject: [JwtConfigService],
        }),
    ],
    providers: [JwtAuthService],
    exports: [JwtAuthService],
})
export class JwtAuthModule {}
