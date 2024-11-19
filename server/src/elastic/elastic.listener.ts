import { Process, Processor } from '@nestjs/bull';
import { Name } from '@libs/enums/queue';
import { Job } from 'bull';
import { ElasticService } from './elastic.service';
import { AddElasticDocument } from './interfaces/add-document.interface';

@Processor(Name.MessagingHub)
export class ElasticListener {
  constructor(private readonly elasticService: ElasticService) {}

  @Process('elastic.add.document')
  async addDocument(job: Job) {
    const { id, index, document } = job.data;

    const data: AddElasticDocument<object> = {
      id,
      index,
      document,
    };

    return this.elasticService.addDocument(data);
  }
}
