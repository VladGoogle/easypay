import { Injectable, OnModuleInit } from '@nestjs/common';
import { LedgerService } from '../../ledger';
import { ListLedgerTransactionsDTO } from '../../ledger/dto';
import { AccountVars, TransactionDetailsVars } from './interfaces';
import { User } from '@libs/entities';
import { QueueClientService } from '@libs/queue-client';
import { join } from 'node:path';
import { InvoiceVars } from './interfaces';
import { v7 as uuidv7 } from 'uuid';

const tplPath = '../invoices/resources/templates';
const iconPath = '../invoices/resources/icons';

@Injectable()
export class GenerateInvoiceService implements OnModuleInit {
  public logoPath: string;
  public templatePath: string;

  constructor(
    private readonly service: LedgerService,
    private readonly queue: QueueClientService,
  ) {}

  onModuleInit(): any {
    this.logoPath = join(__dirname, iconPath, `logo.png`);
    this.templatePath = join(__dirname, tplPath, `invoice.hbs`);
  }

  public async generate(dto: ListLedgerTransactionsDTO, params: User) {
    const data = await this.service.index(dto);

    const transactions = data.data;

    const accountVars: AccountVars = {
      iban: transactions[0]?.account?.iban as string,
      currency: transactions[0]?.account?.currency as string,
    };

    const arrLen = transactions.length;

    let dateRange;

    if (dto?.createdAt) {
      dateRange = dto.createdAt;
    } else {
      dateRange = [null, null];
    }

    const vars: InvoiceVars = {
      fullName: params.fullName,
      invoiceDate: new Date().toISOString().substring(0, 10),
      logoPath: this.logoPath,
      dateRange,
      beforeBalance: transactions[arrLen - 1].pitBalanceBefore as number,
      afterBalance: transactions[0].pitBalanceAfter as number,
      accountVars,
      transactionVars: transactions as unknown as TransactionDetailsVars[],
    };

    const s3Key = join(
      'users',
      params.id,
      'accounts',
      dto.accountId,
      'invoices',
      uuidv7(),
    );

    let tokens;

    if (params?.fcmTokens?.length) {
      tokens = params.fcmTokens;
    }

    await this.queue.messagingHub.add('invoice.upload', {
      templatePath: this.templatePath,
      accountId: dto.accountId,
      s3Key,
      userId: params.id,
      tokens,
      vars,
    });
  }
}
