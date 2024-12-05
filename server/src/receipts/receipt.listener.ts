import { Process, Processor } from '@nestjs/bull';
import { Name } from '@libs/enums/queue';
import { Job } from 'bull';
import { ReceiptsService } from './receipts.service';
import { CreateStatement } from '@libs/interfaces/common';
import { Receipt } from '@libs/entities';

@Processor(Name.MessagingHub)
export class ReceiptListener {
  constructor(private readonly service: ReceiptsService) {}

  @Process('receipt.create')
  async create(job: Job) {
    const data = job.data.data as CreateStatement<Receipt>;

    return this.service.create(data);
  }
}
