import { Client } from "@elastic/elasticsearch";

import { env } from "../env";
import type { ProductSearchHit, ProductSearchService, SearchQuery, SearchResult } from "./product-search.service";

export class ElasticProductSearchService implements ProductSearchService {
  private readonly indexName = "product";
  private readonly client: Client;
  private static instance: ElasticProductSearchService;

  private constructor() {
    this.client = new Client({
      node: `http://${env.ELASTICSEARCH_HOST}:${env.ELASTICSEARCH_PORT}`,
    });
  }

  static async getInstance(): Promise<ElasticProductSearchService> {
    if (!this.instance) {
      this.instance = new ElasticProductSearchService();
      await this.instance.createIndexIfNotExists();
    }

    return this.instance;
  }

  private async createIndexIfNotExists(): Promise<void> {
    try {
      const exists = await this.client.indices.exists({
        index: this.indexName,
      });

      if (!exists) {
        await this.client.indices.create({
          index: this.indexName,
          mappings: {
            properties: {
              id: { type: "text", analyzer: "standard", index: false },
              name: {
                type: "text",
                analyzer: "standard",
                fields: {
                  keyword: { type: "keyword" },
                  suggest: {
                    type: "completion",
                    analyzer: "simple",
                  },
                },
              },
              description: {
                type: "text",
                analyzer: "standard",
                fields: {
                  suggest: {
                    type: "completion",
                    analyzer: "simple",
                  },
                },
              },
              sku: {
                type: "keyword",
                fields: {
                  suggest: {
                    type: "completion",
                  },
                },
              },
              createdAt: { type: "date" },
              updatedAt: { type: "date" },
            },
          },
        });
        console.log(`Created index: ${this.indexName}`);
      }
    } catch (error) {
      console.error(`Failed to create index ${this.indexName}:`, error);
      throw error;
    }
  }

  async searchProducts(searchQuery: SearchQuery): Promise<SearchResult> {
    try {
      const response = await this.client.search<ProductSearchHit>({
        index: this.indexName,
        body: this.buildElasticsearchQuery(searchQuery),
      });

      const hits = response.hits.hits
        .filter(hit => !!hit._source)
        .map<ProductSearchHit>(hit => ({
          id: hit._source!.id,
          name: hit._source!.name,
          description: hit._source!.description,
          sku: hit._source!.sku,
          score: hit._score ?? undefined,
        }));

      return {
        products: hits,
        total: response.hits.total ? typeof response.hits.total === "number" ? response.hits.total : response.hits.total.value : 0,
        from: searchQuery.pagination.from,
        size: searchQuery.pagination.size,
      };
    } catch (error) {
      console.error("Search failed:", error);
      throw error;
    }
  }

  private buildElasticsearchQuery(searchQuery: SearchQuery): any {
    const query: any = {
      query: {
        bool: {
          must: [],
        },
      },
    };

    if (searchQuery.query && searchQuery.query.trim()) {
      query.query.bool.must.push({
        multi_match: {
          query: searchQuery.query,
          fields: ["name^3", "description^2", "sku^2"],
          type: "best_fields",
          fuzziness: "AUTO",
          prefix_length: 1,
        },
      });
    } else {
      query.query.bool.must.push({
        match_all: {},
      });
    }

    if (searchQuery.sort) {
      query.sort = [{ [searchQuery.sort.field]: { order: searchQuery.sort.order } }];
    } else {
      query.sort = [
        { _score: { order: "desc" } },
        { createdAt: { order: "desc" } },
      ];
    }

    if (searchQuery.pagination) {
      query.from = searchQuery.pagination.from || 0;
      query.size = searchQuery.pagination.size || 10;
    } else {
      query.from = 0;
      query.size = 10;
    }

    return query;
  }
}
