import { Module } from '@nestjs/common';

import {SumsubConfigModule} from "@libs/config";
import {QueueClientModule} from "@libs/queue-client";

import { SumsubController } from './sumsub.controller';
import { SumsubService } from './sumsub.service';
import {UsersModule} from "../users";

@Module({
  imports: [SumsubConfigModule,QueueClientModule, UsersModule],
  providers: [SumsubService],
  controllers: [SumsubController]
})
export class SumsubModule {}
