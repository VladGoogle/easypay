import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { FuzzySearch } from '@libs/interfaces/elastic';

import { AddElasticDocument } from './interfaces';
import { IndexRequest } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class ElasticService {
  private readonly logger = new Logger(ElasticService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async ping() {
    try {
      await this.elasticsearchService.ping();
    } catch (e: any) {
      this.logger.error(e.stack);
    }
  }

  async addDocument<T extends IndexRequest>(input: AddElasticDocument<T>) {
    try {
      return await this.elasticsearchService.index({
        index: input.index,
        id: input.id,
        document: input.document,
        refresh: 'wait_for',
      });
    } catch (e: any) {
      this.logger.error(e.stack);
    }
  }

  async searchFuzzyIndices<T>(
    index: string,
    input: FuzzySearch[],
  ): Promise<any> {
    try {
      const queries: object[] = [];

      for (const record of input) {
        queries.push({
          multi_match: {
            fields: [record.field],
            query: record.query,
            operator: 'and',
          },
        });
      }

      const { hits } = await this.elasticsearchService.search({
        index,
        query: {
          bool: {
            must: queries,
          },
        },
      });

      return hits.hits;
    } catch (e: any) {
      this.logger.error(e.stack);
    }
  }

  async createBeneficiaryIndex() {
    try {
      const index = await this.elasticsearchService.indices.exists({
        index: 'beneficiaries',
      });

      if (!index) {
        await this.elasticsearchService.indices.create({
          index: 'beneficiaries',
          settings: {
            number_of_shards: 2,
            number_of_replicas: 1,
            analysis: {
              filter: {
                autocomplete_filter: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 20,
                },
              },
              normalizer: {
                lowercase_normalizer: {
                  type: 'custom',
                  char_filter: [],
                  filter: ['lowercase'],
                },
              },
              analyzer: {
                autocomplete: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'autocomplete_filter'],
                },
              },
            },
          },
          mappings: {
            properties: {
              fullName: {
                type: 'text',
                analyzer: 'autocomplete',
                search_analyzer: 'standard',
              },
              phone: {
                type: 'text',
                analyzer: 'autocomplete',
                search_analyzer: 'standard',
              },
            },
          },
        });
      }
    } catch (e: any) {
      this.logger.error(e.stack);
    }
  }
}
