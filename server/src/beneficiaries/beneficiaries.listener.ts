import { Process, Processor } from '@nestjs/bull';
import { Name } from '@libs/enums/queue';
import { Job } from 'bull';
import { BeneficiariesService } from './beneficiaries.service';

@Processor(Name.MessagingHub)
export class BeneficiariesListener {
  constructor(private readonly beneficiariesService: BeneficiariesService) {}

  @Process('beneficiary.create')
  async create(job: Job) {
    const { dto } = job.data;

    return this.beneficiariesService.create(dto);
  }
}
