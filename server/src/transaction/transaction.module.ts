import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FeeAccount,
  FeeTransaction,
  PaymentAccount,
  Transaction,
} from '@libs/entities';
import { FundLedger } from '@libs/entities/fund-ledger.entity';
import { QueueClientModule } from '@libs/queue-client';
import { TransactionListener } from './transaction.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      FundLedger,
      PaymentAccount,
      FeeAccount,
      FeeTransaction,
    ]),
    QueueClientModule,
  ],
  providers: [TransactionService, TransactionListener],
  controllers: [TransactionController],
})
export class TransactionModule {}
