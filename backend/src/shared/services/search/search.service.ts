/**
 * Search Service for Marketplace
 * Implements Elasticsearch integration for product search
 */
import { Injectable } from '@nestjs/common';
import { Client } from '@elasticsearch/client';

export interface SearchQuery {
  query: string;
  filters?: Record<string, any>;
  sort?: Record<string, any>;
  page?: number;
  perPage?: number;
}

export interface SearchResult {
  total: number;
  items: any[];
  aggregations?: any;
}

@Injectable()
export class SearchService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    });
  }

  /**
   * Index a document
   */
  async index(index: string, id: string, document: any): Promise<void> {
    await this.client.index({
      index,
      id,
      document,
    });
    console.log(`Indexed document ${id} in ${index}`);
  }

  /**
   * Bulk index documents
   */
  async bulkIndex(index: string, documents: Array<{ id: string; doc: any }>): Promise<void> {
    const bulkBody = documents.flatMap((doc) => [
      { index: { _index: index, _id: doc.id } },
      doc.doc,
    ]);

    await this.client.bulk({ body: bulkBody });
    console.log(`Bulk indexed ${documents.length} documents in ${index}`);
  }

  /**
   * Search documents
   */
  async search(index: string, searchQuery: SearchQuery): Promise<SearchResult> {
    const { query, filters, sort, page = 1, perPage = 20 } = searchQuery;

    const must: any[] = [
      {
        multi_match: {
          query,
          fields: ['name', 'description', 'tags'],
          fuzziness: 'AUTO',
        },
      },
    ];

    if (filters) {
      for (const [field, value] of Object.entries(filters)) {
        must.push({ term: { [field]: value } });
      }
    }

    const searchBody: any = {
      query: {
        bool: { must },
      },
      from: (page - 1) * perPage,
      size: perPage,
    };

    if (sort) {
      searchBody.sort = sort;
    }

    const response = await this.client.search({
      index,
      body: searchBody,
    });

    return {
      total: response.hits.total.value,
      items: response.hits.hits.map((hit) => ({
        id: hit._id,
        ...hit._source,
      })),
      aggregations: response.aggregations,
    };
  }

  /**
   * Delete document
   */
  async delete(index: string, id: string): Promise<void> {
    await this.client.delete({
      index,
      id,
    });
    console.log(`Deleted document ${id} from ${index}`);
  }

  /**
   * Create index with mapping
   */
  async createIndex(index: string, mapping: any): Promise<void> {
    await this.client.indices.create({
      index,
      body: { mappings: mapping },
    });
    console.log(`Created index ${index} with mapping`);
  }

  /**
   * Delete index
   */
  async deleteIndex(index: string): Promise<void> {
    await this.client.indices.delete({ index });
    console.log(`Deleted index ${index}`);
  }

  /**
   * Get document by ID
   */
  async get(index: string, id: string): Promise<any> {
    const response = await this.client.get({
      index,
      id,
    });

    return {
      id: response._id,
      ...response._source,
    };
  }
}
