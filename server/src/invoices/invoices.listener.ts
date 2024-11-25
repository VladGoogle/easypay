import { Process, Processor } from '@nestjs/bull';
import { Name } from '@libs/enums/queue';
import { Job } from 'bull';
import { InvoicesService } from './invoices.service';

@Processor(Name.MessagingHub)
export class InvoicesListener {
  constructor(private readonly service: InvoicesService) {}

  @Process('invoice.create')
  async create(job: Job) {
    const { dto } = job.data;

    return this.service.create(dto);
  }
}
