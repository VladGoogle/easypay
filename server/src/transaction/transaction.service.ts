import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Beneficiary,
  FeeAccount,
  FeeTransaction,
  PaymentAccount,
  Transaction,
  User,
} from '@libs/entities';
import {
  DeepPartial,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';
import { FundLedger } from '@libs/entities/fund-ledger.entity';
import { isEmpty, omit } from 'lodash';
import { CreateTransactionDTO, UpdateTransactionDTO } from './dto';
import { v7 as uuidv7 } from 'uuid';
import { DirectionType, TransactionStatus } from '@libs/enums/transaction';
import { pgReturning } from '@libs/utils';
import { PaymentIntent } from '@libs/interfaces/stripe';
import { QueueClientService } from '@libs/queue-client';
import { SumsubTransactionStatus } from '@libs/enums/sumsub';
import { FeeTransactionStatus } from '@libs/enums/fee-transaction';
import { ByIdNotFoundException } from '@libs/exceptions';
import { CreateBeneficiary } from '@libs/interfaces/beneficiary';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(FundLedger)
    private readonly ledgerRepository: Repository<FundLedger>,
    @InjectRepository(PaymentAccount)
    private readonly accountRepository: Repository<PaymentAccount>,
    @InjectRepository(FeeAccount)
    private readonly feeAccountRepository: Repository<FeeAccount>,
    @InjectRepository(FeeTransaction)
    private readonly feeTransactionRepository: Repository<FeeTransaction>,
    private readonly queue: QueueClientService,
  ) {}

  async getOne(id: string, runner?: QueryRunner): Promise<Transaction> {
    const builder = this.transactionRepository.createQueryBuilder('t');

    const where: FindOptionsWhere<Transaction> = {
      id,
    };

    if (runner) {
      builder
        .setQueryRunner(runner)
        .useTransaction(true)
        .setLock('pessimistic_write');
    }

    let res;

    try {
      res = await builder.where(where).getOne();
    } catch (e) {
      throw e;
    }

    if (!res) {
      throw new ByIdNotFoundException(Transaction, id);
    }

    return res;
  }

  public async create(
    dto: CreateTransactionDTO,
    params: User,
  ): Promise<Transaction> {
    const { senderAccountId, amount, total, type, currency } = dto;

    if (
      !dto.receiverAccountId &&
      (!dto.transactionDetails || isEmpty(dto.transactionDetails))
    ) {
      throw new BadRequestException(
        'Either receiver account id should be provided or plain transaction details',
      );
    }

    const runner =
      this.transactionRepository.manager.connection.createQueryRunner();

    await runner.connect();
    await runner.startTransaction();

    const transactionDto: DeepPartial<Transaction> = {
      id: uuidv7(),
      senderAccountId,
      amount,
      total,
      type,
      currency,
      status: TransactionStatus.PENDING,
      sumsubStatus: SumsubTransactionStatus.REVIEWED,
    };

    if (dto?.receiverAccountId) {
      transactionDto.receiverAccountId = dto.receiverAccountId;
    }

    if (dto?.comment) {
      transactionDto.comment = dto.comment;
    }

    if (dto?.tax) {
      transactionDto.tax = dto.tax;
    }

    if (dto?.transactionDetails) {
      transactionDto.transactionDetails = dto.transactionDetails;
    }

    const beneficiaryDto: DeepPartial<Beneficiary> = {
      id: uuidv7(),
      type,
      currency,
      userId: params.id,
    };

    try {
      const { raw: result } = await this.transactionRepository
        .createQueryBuilder()
        .setQueryRunner(runner)
        .useTransaction(true)
        .insert()
        .values(transactionDto)
        .returning(pgReturning(this.transactionRepository))
        .execute();

      const senderWhere: FindOptionsWhere<PaymentAccount> = {
        id: senderAccountId,
        userId: params.id,
      };

      const senderAccount = await this.accountRepository
        .createQueryBuilder('a')
        .setQueryRunner(runner)
        .useTransaction(true)
        .setLock('pessimistic_write')
        .where(senderWhere)
        .getOne();

      if (!senderAccount) {
        throw new BadRequestException('Sender account not found');
      }

      if (senderAccount.actualBalance < total) {
        throw new BadRequestException(
          'Not enough funds to complete a transaction',
        );
      }

      const outgoingLedgerTransactionDto: DeepPartial<FundLedger> = {
        id: uuidv7(),
        transactionId: transactionDto.id,
        accountId: senderAccountId,
        net_amount: total,
        pitBalanceBefore: senderAccount.actualBalance,
        pitBalanceAfter: senderAccount.actualBalance - total,
        directionType: DirectionType.OUTGOING,
      };

      await this.ledgerRepository
        .createQueryBuilder()
        .setQueryRunner(runner)
        .useTransaction(true)
        .insert()
        .values(outgoingLedgerTransactionDto)
        .returning(pgReturning(this.ledgerRepository))
        .execute();

      await this.accountRepository
        .createQueryBuilder()
        .setQueryRunner(runner)
        .useTransaction(true)
        .update()
        .where(senderWhere)
        .set({
          actualBalance: () => `actualBalance - ${total}`,
        })
        .execute();

      if (dto?.receiverAccountId) {
        const receiverWhere: FindOptionsWhere<PaymentAccount> = {
          id: dto.receiverAccountId,
        };

        const receiverAccount = await this.accountRepository
          .createQueryBuilder('p')
          .setQueryRunner(runner)
          .useTransaction(true)
          .setLock('pessimistic_write')
          .where(receiverWhere)
          .innerJoinAndSelect('p.user', 'u')
          .getOne();

        if (!receiverAccount) {
          throw new BadRequestException('Receiver account not found');
        }

        let balanceAddition;

        if (dto?.tax) {
          balanceAddition = amount;
        } else {
          balanceAddition = total;
        }

        const receiverLedgerTransactionDto: DeepPartial<FundLedger> = {
          id: uuidv7(),
          transactionId: transactionDto.id,
          accountId: dto.receiverAccountId,
          net_amount: total,
          pitBalanceBefore: receiverAccount.actualBalance,
          pitBalanceAfter: receiverAccount.actualBalance + balanceAddition,
          directionType: DirectionType.INCOMING,
        };

        await this.ledgerRepository
          .createQueryBuilder()
          .setQueryRunner(runner)
          .useTransaction(true)
          .insert()
          .values(receiverLedgerTransactionDto)
          .returning(pgReturning(this.ledgerRepository))
          .execute();

        await this.accountRepository
          .createQueryBuilder()
          .setQueryRunner(runner)
          .useTransaction(true)
          .update()
          .where(receiverWhere)
          .set({
            pendingBalance: () => `pendingBalance + ${balanceAddition}`,
          })
          .execute();

        beneficiaryDto.accountId = receiverAccount.id;
        beneficiaryDto.firstName = receiverAccount.user?.firstName;
        beneficiaryDto.lastName = receiverAccount.user?.lastName;
        beneficiaryDto.phone = receiverAccount.user?.phone;
      } else {
        beneficiaryDto.details = omit(dto.transactionDetails, [
          'firstName',
          'lastName',
          'phone',
        ]);
        beneficiaryDto.firstName = dto.transactionDetails?.firstName;
        beneficiaryDto.lastName = dto.transactionDetails?.lastName;

        if (dto.transactionDetails?.phone) {
          beneficiaryDto.phone = dto.transactionDetails.phone;
        }
      }

      if (dto?.tax) {
        const feeAccountWhere: FindOptionsWhere<FeeAccount> = {
          currency: senderAccount.currency,
        };

        const feeAccount = await this.feeAccountRepository
          .createQueryBuilder()
          .setQueryRunner(runner)
          .useTransaction(true)
          .setLock('pessimistic_write')
          .addSelect('id')
          .where(feeAccountWhere)
          .getOne();

        if (feeAccount) {
          const feeTransactionPayload: DeepPartial<FeeTransaction> = {
            id: uuidv7(),
            amount: dto.tax,
            transactionId: transactionDto.id,
            feeAccountId: feeAccount.id,
            status: FeeTransactionStatus.PENDING,
          };

          await this.feeTransactionRepository
            .createQueryBuilder()
            .setQueryRunner(runner)
            .useTransaction(true)
            .insert()
            .values(feeTransactionPayload)
            .execute();

          await this.feeAccountRepository
            .createQueryBuilder()
            .setQueryRunner(runner)
            .useTransaction(true)
            .update()
            .set({
              pendingBalance: () => `pendingBalance + ${dto.tax}`,
            })
            .execute();
        }
      }

      const [returned] = result as [DeepPartial<Transaction>];

      const res = this.transactionRepository.merge(new Transaction(), returned);

      const paymentIntentPayload: PaymentIntent = {
        customerId: params.stripeCustomerId as string,
        transactionId: transactionDto.id as string,
        amount: total,
        currency: senderAccount.currency.toLowerCase(),
        paymentMethod: senderAccount.stripePaymentMethodId as string,
      };

      await this.queue.messagingHub.add('stripe.payment-intent.create', {
        ...paymentIntentPayload,
      });

      await this.queue.messagingHub.add('beneficiary.create', {
        dto: beneficiaryDto,
      });

      // const sumsubTransactionData = {
      //     applicantId: params?.applicantId,
      //     transactionId: res.id,
      //     amount: total,
      //     currency: senderAccount.currency,
      //     date: res.createdAt,
      //     accountId: senderAccount.id,
      //     country: senderAccount.country?.iso3Code as string,
      //     bic: senderAccount.bic
      // } as SumsubTransaction
      //
      // await this.queue.messagingHub.add('sumsub.transaction.create', {
      //     ...sumsubTransactionData
      // })

      await runner.commitTransaction();

      return res;
    } catch (e: any) {
      await runner.rollbackTransaction();

      throw e;
    } finally {
      await runner.release();
    }
  }

  public async updateStatus(
    id: string,
    dto: UpdateTransactionDTO,
  ): Promise<Transaction> {
    const runner =
      this.transactionRepository.manager.connection.createQueryRunner();

    await runner.connect();
    await runner.startTransaction();

    try {
      const where: FindOptionsWhere<Transaction> = {
        id,
      };

      const transaction = await this.getOne(id, runner);

      const { raw: result } = await this.transactionRepository
        .createQueryBuilder()
        .setQueryRunner(runner)
        .useTransaction(true)
        .update()
        .where(where)
        .set(dto)
        .execute();

      const senderWhere: FindOptionsWhere<PaymentAccount> = {
        id: transaction?.senderAccountId,
      };

      const senderAccount = await this.accountRepository
        .createQueryBuilder('a')
        .setQueryRunner(runner)
        .useTransaction(true)
        .setLock('pessimistic_write')
        .where(senderWhere)
        .getOne();

      if (dto.status === TransactionStatus.APPROVED) {
        if (senderAccount) {
          await this.accountRepository
            .createQueryBuilder()
            .setQueryRunner(runner)
            .useTransaction(true)
            .update()
            .where(senderWhere)
            .set({
              pendingBalance: () => `pendingBalance - ${transaction?.total}`,
            })
            .execute();
        }

        if (transaction?.receiverAccountId) {
          const receiverWhere: FindOptionsWhere<PaymentAccount> = {
            id: transaction.receiverAccountId,
          };

          const receiverAccount = await this.accountRepository
            .createQueryBuilder('a')
            .setQueryRunner(runner)
            .useTransaction(true)
            .setLock('pessimistic_write')
            .where(receiverWhere)
            .getOne();

          if (receiverAccount) {
            let balanceAddition;

            if (transaction?.tax) {
              balanceAddition = transaction.amount;
            } else {
              balanceAddition = transaction.total;
            }

            await this.accountRepository
              .createQueryBuilder()
              .setQueryRunner(runner)
              .useTransaction(true)
              .update()
              .where(receiverWhere)
              .set({
                actualBalance: () => `actualBalance + ${balanceAddition}`,
              })
              .execute();
          }
        }

        if (transaction?.tax) {
          const feeAccountWhere: FindOptionsWhere<FeeAccount> = {
            currency: senderAccount?.currency,
          };

          const feeAccount = await this.feeAccountRepository
            .createQueryBuilder()
            .setQueryRunner(runner)
            .useTransaction(true)
            .setLock('pessimistic_write')
            .where(feeAccountWhere)
            .getOne();

          if (feeAccount) {
            const feeTransactionWhere: FindOptionsWhere<FeeTransaction> = {
              transactionId: transaction.id,
            };

            const feeTransaction = await this.feeTransactionRepository
              .createQueryBuilder()
              .setQueryRunner(runner)
              .useTransaction(true)
              .setLock('pessimistic_write')
              .where(feeTransactionWhere)
              .getOne();

            if (feeTransaction) {
              const feeTransactionUpdate: DeepPartial<FeeTransaction> = {
                status: FeeTransactionStatus.APPROVED,
              };

              await this.feeTransactionRepository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .update()
                .where(feeTransactionWhere)
                .set(feeTransactionUpdate)
                .execute();

              if (feeTransaction.feeAccountId !== feeAccount.id) {
                await this.feeAccountRepository
                  .createQueryBuilder()
                  .setQueryRunner(runner)
                  .useTransaction(true)
                  .update()
                  .set({
                    pendingBalance: () => `pendingBalance + ${transaction.tax}`,
                    actualBalance: () => `actualBalance + ${transaction.tax}`,
                  })
                  .execute();
              } else {
                await this.feeAccountRepository
                  .createQueryBuilder()
                  .setQueryRunner(runner)
                  .useTransaction(true)
                  .update()
                  .set({
                    actualBalance: () => `actualBalance + ${transaction.tax}`,
                  })
                  .execute();
              }
            }
          }
        }
      } else if (dto.status === TransactionStatus.REJECTED) {
        if (senderAccount) {
          await this.accountRepository
            .createQueryBuilder()
            .setQueryRunner(runner)
            .useTransaction(true)
            .update()
            .where(senderWhere)
            .set({
              actualBalance: () => `actualBalance + ${transaction?.total}`,
            })
            .execute();
        }

        if (transaction?.receiverAccountId) {
          const receiverWhere: FindOptionsWhere<PaymentAccount> = {
            id: transaction.receiverAccountId,
          };

          const receiverAccount = await this.accountRepository
            .createQueryBuilder('a')
            .setQueryRunner(runner)
            .useTransaction(true)
            .setLock('pessimistic_write')
            .where(receiverWhere)
            .getOne();

          if (receiverAccount) {
            let balanceAddition;

            if (transaction?.tax) {
              balanceAddition = transaction.amount;
            } else {
              balanceAddition = transaction.total;
            }

            await this.accountRepository
              .createQueryBuilder()
              .setQueryRunner(runner)
              .useTransaction(true)
              .update()
              .where(receiverWhere)
              .set({
                pendingBalance: () => `pendingBalance - ${balanceAddition}`,
              })
              .execute();
          }
        }

        if (transaction?.tax) {
          const feeAccountWhere: FindOptionsWhere<FeeAccount> = {
            currency: transaction?.currency,
          };

          const feeAccount = await this.feeAccountRepository
            .createQueryBuilder()
            .setQueryRunner(runner)
            .useTransaction(true)
            .setLock('pessimistic_write')
            .where(feeAccountWhere)
            .getOne();

          if (feeAccount) {
            const feeTransactionWhere: FindOptionsWhere<FeeTransaction> = {
              transactionId: transaction.id,
            };

            const feeTransaction = await this.feeTransactionRepository
              .createQueryBuilder()
              .setQueryRunner(runner)
              .useTransaction(true)
              .setLock('pessimistic_write')
              .where(feeTransactionWhere)
              .getOne();

            if (feeTransaction) {
              const feeTransactionUpdate: DeepPartial<FeeTransaction> = {
                status: FeeTransactionStatus.REJECTED,
              };

              await this.feeTransactionRepository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .update()
                .where(feeTransactionWhere)
                .set(feeTransactionUpdate)
                .execute();

              if (feeTransaction.feeAccountId === feeAccount.id) {
                await this.feeAccountRepository
                  .createQueryBuilder()
                  .setQueryRunner(runner)
                  .useTransaction(true)
                  .update()
                  .set({
                    pendingBalance: () => `pendingBalance - ${transaction.tax}`,
                  })
                  .execute();
              }
            }
          }
        }
      }

      await runner.commitTransaction();

      const [returned] = result as [Transaction];

      return this.transactionRepository.merge(
        <Transaction>transaction,
        returned,
      );
    } catch (e: any) {
      await runner.rollbackTransaction();

      throw e;
    } finally {
      await runner.release();
    }
  }

  public async update(
    id: string,
    dto: DeepPartial<Transaction>,
  ): Promise<Transaction> {
    const runner =
      this.transactionRepository.manager.connection.createQueryRunner();

    await runner.connect();
    await runner.startTransaction();

    try {
      const where: FindOptionsWhere<Transaction> = {
        id,
      };

      const transaction = await this.getOne(id, runner);

      const { raw: result } = await this.transactionRepository
        .createQueryBuilder()
        .setQueryRunner(runner)
        .useTransaction(true)
        .update()
        .where(where)
        .set(dto)
        .execute();

      await runner.commitTransaction();

      const [returned] = result as [Transaction];

      return this.transactionRepository.merge(
        <Transaction>transaction,
        returned,
      );
    } catch (e: any) {
      await runner.rollbackTransaction();

      throw e;
    } finally {
      await runner.release();
    }
  }
}
