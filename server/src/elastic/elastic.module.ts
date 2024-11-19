import { Module, OnModuleInit } from '@nestjs/common';
import {
  ElasticsearchModule,
  ElasticsearchModuleOptions,
} from '@nestjs/elasticsearch';

import { ElasticConfigModule, ElasticConfigService } from '@libs/config';

import { ElasticListener } from './elastic.listener';
import { ElasticService } from './elastic.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ElasticConfigModule],
      useFactory: (
        config: ElasticConfigService,
      ): ElasticsearchModuleOptions => ({
        node: config.node,
        auth: {
          username: config.user,
          password: config.password,
        },
      }),
      inject: [ElasticConfigService],
    }),
    ElasticConfigModule,
  ],
  providers: [ElasticService, ElasticListener],
  exports: [ElasticService],
})
export class ElasticModule {
  constructor(private elasticService: ElasticService) {}

  async onModuleInit(): Promise<any> {
    await this.elasticService.ping();
    return await this.elasticService.createBeneficiaryIndex();
  }
}
