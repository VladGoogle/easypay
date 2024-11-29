import { Process, Processor } from '@nestjs/bull';
import { Name } from '@libs/enums/queue';
import { Job } from 'bull';
import { InvoicesService } from './invoices.service';
import { CreateStatement } from '@libs/interfaces/common';
import { Invoice } from '@libs/entities';

@Processor(Name.MessagingHub)
export class InvoicesListener {
  constructor(private readonly service: InvoicesService) {}

  @Process('invoice.create')
  async create(job: Job) {
    const data = job.data.data as CreateStatement<Invoice>;

    return this.service.create(data);
  }
}
