import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {FeeAccount} from "@libs/entities";

import {FEE_ACCOUNT_REPOSITORY_TOKEN} from "./constants";
import { FeeAccountsController } from './fee-accounts.controller';
import { FeeAccountsService } from './fee-accounts.service';
import {FeeAccountsRepository} from "./repositories";

@Module({
  imports: [TypeOrmModule.forFeature([FeeAccount])],
  providers: [
    FeeAccountsService,
    {
      provide: FEE_ACCOUNT_REPOSITORY_TOKEN,
      useClass: FeeAccountsRepository,
    },
  ],
  controllers: [FeeAccountsController]
})
export class FeeAccountsModule {}
