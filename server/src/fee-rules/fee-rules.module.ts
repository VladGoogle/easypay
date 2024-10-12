import { Module } from '@nestjs/common';
import { FeeRulesController } from './fee-rules.controller';
import { FeeRulesService } from './fee-rules.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FeeRulesRepository} from "./repositories";
import {FEE_RULES_REPOSITORY_TOKEN} from "./constants";
import {FeeRules} from "@libs/entities/fee-rules.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FeeRules])],
  providers: [
    FeeRulesService,
    {
      provide: FEE_RULES_REPOSITORY_TOKEN,
      useClass: FeeRulesRepository,
    },
  ],
  controllers: [FeeRulesController],
})
export class FeeRulesModule {}
