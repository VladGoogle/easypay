import { Process, Processor } from '@nestjs/bull';
import { Name } from '@libs/enums/queue';
import { Job } from 'bull';
import { ReceiptsService } from './receipts.service';

@Processor(Name.MessagingHub)
export class ReceiptListener {
  constructor(private readonly service: ReceiptsService) {}

  @Process('receipt.create')
  async create(job: Job) {
    const { dto } = job.data;

    return this.service.create(dto);
  }
}
