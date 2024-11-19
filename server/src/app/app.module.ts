import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AppConfigModule,
  DbConfigModule,
  DbConfigService,
  ElasticConfigModule,
  ElasticConfigService,
} from '@libs/config';
import * as entities from '@libs/entities';

import { AccountsModule } from '../accounts';
import { AddressModule } from '../address';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth';
import { CountryModule } from '../country';
import { SumsubModule } from '../sumsub';
import { UsersModule } from '../users';
import { StripeModule } from '../stripe';
import { AdminModule } from '../admin';
import { FeeAccountsModule } from '../fee-accounts';
import { FeeRulesModule } from '../fee-rules';
import { SendModule } from '../emails';
import { TwoFactorAuthenticationModule } from '../two-factor-auth';
import { TransactionModule } from '../transaction';
import { BeneficiariesModule } from '../beneficiaries';
import {
  ElasticsearchModule,
  ElasticsearchModuleOptions,
} from '@nestjs/elasticsearch';
import { LedgerModule } from '../ledger';
import { ElasticModule } from '../elastic';

@Module({
  imports: [
    AccountsModule,
    AdminModule,
    BeneficiariesModule,
    FeeAccountsModule,
    FeeRulesModule,
    AddressModule,
    AppConfigModule,
    AuthModule,
    CountryModule,
    ElasticModule,
    LedgerModule,
    SendModule,
    StripeModule,
    SumsubModule,
    TransactionModule,

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

    TwoFactorAuthenticationModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
