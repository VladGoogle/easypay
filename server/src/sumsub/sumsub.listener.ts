import { Process, Processor } from '@nestjs/bull';
import { Name } from '@libs/enums/queue';
import { Job } from 'bull';
import { SumsubService } from './sumsub.service';

@Processor(Name.MessagingHub)
export class SumsubListener {
  constructor(private readonly sumsubService: SumsubService) {}

  @Process('sumsub.transaction.create')
  async createSumsubTransaction(job: Job) {
    return this.sumsubService.createSumsubTransaction(job.data);
  }
}
