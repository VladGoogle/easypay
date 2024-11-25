import { Injectable, OnModuleInit } from '@nestjs/common';
import { GetOneReceipt } from '../interfaces';
import { LedgerService } from '../../ledger';
import { GetOneLedgerTransactionsDTO } from '../../ledger/dto';
import { ReceiptVars, TransactionDetailsVars } from './interfaces';
import { ReceiverVars, SenderVars } from './interfaces';
import { User } from '@libs/entities';
import { v7 as uuidv7 } from 'uuid';
import { QueueClientService } from '@libs/queue-client';
import { join } from 'node:path';
import { Currency } from '@libs/enums/accounts';
import {
  DirectionType,
  TransactionStatus,
  TransactionType,
} from '@libs/enums/transaction';

const tplPath = '../receipts/resources/templates';
const iconPath = '../receipts/resources/icons';

@Injectable()
export class GenerateReceiptService implements OnModuleInit {
  public logoPath: string;
  public templatePath: string;

  constructor(
    private readonly service: LedgerService,
    private readonly queue: QueueClientService,
  ) {}

  onModuleInit(): any {
    this.logoPath = join(__dirname, iconPath, `logo.png`);
    this.templatePath = join(__dirname, tplPath, `receipt.hbs`);
  }

  public async generate(id: string, params: User) {
    const dto: GetOneLedgerTransactionsDTO = {
      include: [
        'senderAccount',
        'receiverAccount',
        'senderAccount.user',
        'receiverAccount.user',
      ],
    };

    const data: GetOneReceipt = {
      id,
      dto,
    };

    const ledger = await this.service.getOne(data);

    const senderVars: SenderVars = {
      fullName: ledger.transaction?.senderAccount?.user?.fullName,
      iban: ledger.transaction?.senderAccount?.iban,
    };

    const receiverVars = {} as ReceiverVars;

    if (ledger?.transaction?.receiverAccountId) {
      receiverVars.fullName = ledger?.transaction?.receiverAccount?.user
        ?.fullName as string;
      receiverVars.iban = ledger?.transaction?.receiverAccount?.iban as string;
    } else {
      const transactionDetails = ledger.transaction
        ?.transactionDetails as object;

      receiverVars.fullName = transactionDetails['fullName'] as string;
      receiverVars.iban = transactionDetails['iban'] as string;
    }

    const transactionDetailsVars: TransactionDetailsVars = {
      ledgerId: ledger.id,
      amount: ledger.transaction?.amount as number,
      tax: ledger.transaction?.tax,
      type: ledger.transaction?.type as TransactionType,
      currency: ledger.transaction?.currency as Currency,
      directionType: ledger.directionType as DirectionType,
      pitBalanceBefore: ledger.pitBalanceBefore as number,
      pitBalanceAfter: ledger.pitBalanceAfter as number,
      transactionDate: ledger.transaction?.createdAt
        .toISOString()
        .substring(0, 10) as string,
      status: ledger.transaction?.status as TransactionStatus,
    };

    const vars: ReceiptVars = {
      receiptId: uuidv7(),
      receiptDate: new Date().toISOString().substring(0, 10),
      logoPath: this.logoPath,
      sender: senderVars,
      receiver: receiverVars,
      transactionDetails: transactionDetailsVars,
    };

    const s3Key = join(
      'users',
      params.id,
      'accounts',
      ledger.accountId,
      'transactions',
      ledger.id,
    );

    let tokens;

    if (params?.fcmTokens?.length) {
      tokens = params.fcmTokens;
    }

    await this.queue.messagingHub.add('receipt.upload', {
      templatePath: this.templatePath,
      s3Key,
      userId: params.id,
      tokens,
      vars,
    });
  }
}
