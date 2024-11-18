import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { Name } from '@libs/enums/queue';

import { AccountsService } from './accounts.service';

@Processor(Name.MessagingHub)
export class AccountsListener {
  constructor(private readonly accountService: AccountsService) {}

  @Process('account.update')
  async update(job: Job) {
    const { id, update } = job.data;

    await this.accountService.update(id, update);
  }
}
