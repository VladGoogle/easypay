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
import {AdminModule} from "../admin";
import {FeeAccountsModule} from "../fee-accounts";
import {FeeRulesModule} from "../fee-rules";
import {SendModule} from "../emails";

@Module({
  imports: [
      AdminModule,
      FeeAccountsModule,
      FeeRulesModule,
      AddressModule,
      AppConfigModule,
      AuthModule,
      CountryModule,
      SendModule,
      StripeModule,
      SumsubModule,
      TypeOrmModule.forRootAsync({
          imports: [DbConfigModule],
          inject: [DbConfigService],
          useFactory: (config: DbConfigService) => ({
              type: config.type,
              host: config.host,
              port: config.port,
              username: config.username,
              password: config.password,
              database: config.database,
              entities: Object.values(entities),
              synchronize: false,
              logging: config.logging,
              subscribers: ['dist/**/**/*.subscriber{.ts,.js}'],
          }),
      }),
      UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
