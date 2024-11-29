import { Module } from '@nestjs/common';
import {
  ElasticsearchModule,
  ElasticsearchModuleOptions,
} from '@nestjs/elasticsearch';

import { ElasticConfigModule, ElasticConfigService } from '@libs/config';

import { ElasticListener } from './elastic.listener';
import { ElasticService } from './elastic.service';
import { ElasticController } from './elastic.controller';

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
  controllers: [ElasticController],
})
export class ElasticModule {}
