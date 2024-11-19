import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundLedger } from '@libs/entities';

@Module({
  imports: [TypeOrmModule.forFeature([FundLedger])],
  providers: [LedgerService],
  controllers: [LedgerController],
})
export class LedgerModule {}
