import { Controller, Post } from '@nestjs/common';
import { ElasticService } from './elastic.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('elastic')
export class ElasticController {
  constructor(private readonly elasticService: ElasticService) {}

  @Post()
  async createBeneficiaryIndex() {
    return await this.elasticService.createBeneficiaryIndex();
  }
}
