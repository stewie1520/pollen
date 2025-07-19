import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  IndexListingChannelDocument,
  SearchService,
} from 'src/core/application/services/search.service';

@Injectable()
export class ElasticSearchService implements SearchService {
  private readonly listingChannelIndexName = 'listing_channel';

  constructor(private readonly client: ElasticsearchService) {}

  async indexListingChannel(input: IndexListingChannelDocument): Promise<void> {
    try {
      await this.client.index({
        index: this.listingChannelIndexName,
        id: input.id,
        document: input,
        refresh: 'wait_for', // Wait for the document to be searchable
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      Logger.error(`Failed to index listing channel ${input.id}:`, error);
      throw new Error(`Failed to index listing channel: ${errorMessage}`);
    }
  }

  async deleteListingChannel(listingChannelId: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.listingChannelIndexName,
        id: listingChannelId,
        refresh: 'wait_for',
      });
    } catch (error: unknown) {
      const elasticError = error as {
        meta?: { statusCode?: number; [key: string]: unknown };
      };

      if (elasticError.meta?.statusCode === 404) {
        Logger.warn(
          `Listing channel ${listingChannelId} not found for deletion`,
        );
        return; // Document doesn't exist, nothing to delete
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      Logger.error(
        `Failed to delete listing channel ${listingChannelId}:`,
        error,
      );
      throw new Error(`Failed to delete listing channel: ${errorMessage}`);
    }
  }

  async searchListingChannel(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<{ total: number; data: IndexListingChannelDocument[] }> {
    try {
      const from = (page - 1) * limit;

      const { hits } = await this.client.search<IndexListingChannelDocument>({
        index: this.listingChannelIndexName,
        from,
        size: limit,
        query: {
          bool: {
            should: [
              {
                match: {
                  channel_listing_name: {
                    query,
                    fuzziness: 'AUTO',
                  },
                },
              },
              {
                nested: {
                  path: 'listings',
                  query: {
                    match: {
                      'listings.variant_name': {
                        query,
                        fuzziness: 'AUTO',
                      },
                    },
                  },
                },
              },
              {
                nested: {
                  path: 'listings.batches',
                  query: {
                    match: {
                      'listings.batches.batch_no': {
                        query,
                        fuzziness: 'AUTO',
                      },
                    },
                  },
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
      });

      const totalHits =
        typeof hits.total === 'number' ? hits.total : (hits.total?.value ?? 0);

      // Safely map the search hits to IndexListingChannelDocument
      const data = hits.hits.reduce<IndexListingChannelDocument[]>(
        (acc, hit) => {
          if (hit._source && hit._id) {
            acc.push({
              ...hit._source,
              id: hit._id,
            });
          }
          return acc;
        },
        [],
      );

      return {
        total: totalHits,
        data,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      Logger.error('Search failed:', error);
      throw new Error(`Search failed: ${errorMessage}`);
    }
  }

  async initIndices(): Promise<void> {
    const indexExists = await this.client.indices.exists({
      index: this.listingChannelIndexName,
    });

    if (!indexExists) {
      await this.client.indices.create({
        index: this.listingChannelIndexName,
        mappings: {
          properties: {
            id: { type: 'keyword' },
            channel_listing_name: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
            sales_channel: { type: 'keyword' },
            lms_company_id: { type: 'keyword' },
            updated_by: { type: 'keyword' },
            listings: {
              type: 'nested',
              properties: {
                var_listing_id: { type: 'keyword' },
                listing_no: { type: 'keyword' },
                listing_status: { type: 'keyword' },
                sku: { type: 'keyword' },
                variant_name: {
                  type: 'text',
                  fields: {
                    keyword: {
                      type: 'keyword',
                      ignore_above: 256,
                    },
                  },
                },
                category_id: { type: 'keyword' },
                category_name: { type: 'keyword' },
                sub_category_id: { type: 'keyword' },
                sub_category_name: { type: 'keyword' },
                image: { type: 'keyword' },
                batches: {
                  type: 'nested',
                  properties: {
                    batch_id: { type: 'keyword' },
                    batch_no: { type: 'keyword' },
                    batch_image: { type: 'keyword' },
                    pkg_qty: { type: 'integer' },
                    pkg_type: { type: 'keyword' },
                    retail_price_per_pkg: {
                      type: 'scaled_float',
                      scaling_factor: 100,
                    },
                    unit_per_pkg: { type: 'integer' },
                    currency_code: { type: 'keyword' },
                    retail_price_per_unit: {
                      type: 'scaled_float',
                      scaling_factor: 100,
                    },
                    list_price_per_pkg: {
                      type: 'scaled_float',
                      scaling_factor: 100,
                    },
                    list_price_per_unit: {
                      type: 'scaled_float',
                      scaling_factor: 100,
                    },
                    batch_discount: { type: 'float' },
                    expiry_date: { type: 'date' },
                    warehouse_id: { type: 'keyword' },
                    warehouse_name: { type: 'keyword' },
                    warehouse_country: { type: 'keyword' },
                    warehouse_country_id: { type: 'keyword' },
                    status: { type: 'keyword' },
                    batch_created_at: { type: 'date' },
                    batch_updated_at: { type: 'date' },
                    batch_updated_by: { type: 'keyword' },
                    batch_created_by: { type: 'keyword' },
                  },
                },
              },
            },
          },
        },
      });

      Logger.log('Listing channel index created');
    } else {
      Logger.log('Listing channel index already exists');
    }
  }
}
