import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { Name } from '@libs/enums/queue';

import { TransactionService } from './transaction.service';

@Processor(Name.MessagingHub)
export class TransactionListener {
  constructor(private readonly transactionService: TransactionService) {}

  @Process('transaction.update')
  async update(job: Job) {
    const { id, update } = job.data;

    return this.transactionService.update(id, update);
  }
}
