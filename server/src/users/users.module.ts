import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {CacheManagerModule} from "@libs/cache-manager";
import {User} from "@libs/entities";

import {USER_INTERFACE_TOKEN} from "./constants";
import {UsersRepository} from "./repositories";
import {UsersController} from "./users.controller";
import {UserListener} from "./users.listener";
import {UsersService} from "./users.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        CacheManagerModule
    ],
    providers: [
        UserListener,
        UsersService,
        {
            provide: USER_INTERFACE_TOKEN,
            useClass: UsersRepository,
        },
    ],
    controllers: [UsersController],
    exports: [
        {
            provide: USER_INTERFACE_TOKEN,
            useClass: UsersRepository,
        }
    ]
})
export class UsersModule {}
