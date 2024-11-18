import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentAccount, User } from '@libs/entities';
import { ACCOUNT_REPOSITORY_TOKEN } from './constants';
import { AccountsRepository } from './repositories';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AdminAccountsController } from './admin';
import { QueueClientModule } from '@libs/queue-client';
import { AccountsListener } from './accounts.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentAccount, User]),
    QueueClientModule,
  ],
  providers: [
    AccountsService,
    {
      provide: ACCOUNT_REPOSITORY_TOKEN,
      useClass: AccountsRepository,
    },
    AccountsListener,
  ],
  controllers: [AccountsController, AdminAccountsController],
})
export class AccountsModule {}
