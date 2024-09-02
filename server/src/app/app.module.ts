import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {AppConfigModule, DbConfigModule, DbConfigService} from '@libs/config';
import * as entities from '@libs/entities';

import {AddressModule} from "../address";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AuthModule} from "../auth";
import {CountryModule} from "../country";
import {SumsubModule} from "../sumsub";
import {UsersModule} from "../users";
import {StripeModule} from "../stripe";

@Module({
  imports: [
      AddressModule,
      AppConfigModule,
      AuthModule,
      CountryModule,
      StripeModule,
      SumsubModule,
      TypeOrmModule.forRootAsync({
        imports: [DbConfigModule],
        useFactory: (config: DbConfigService) => ({
          type: config.type,
          url: config.url,
          entities: Object.values(entities),
          synchronize: false,
          logging: config.logging,
            subscribers: ['dist/**/**/*.subscriber{.ts,.js}'],
        }),
        inject: [DbConfigService],
      }),
      UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
