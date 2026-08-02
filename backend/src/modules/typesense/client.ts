// Typesense client for trove

import Typesense from 'typesense';

class TypesenseService {
  private client: any;

  constructor(config: any) {
    this.client = new Typesense.Client({
      nodes: config.nodes,
      apiKey: config.apiKey,
      connectionTimeoutSeconds: 2
    });
  }

  async indexDocument(collection: string, document: any) {
    return await this.client.collections(collection).documents().create(document);
  }

  async updateDocument(collection: string, id: string, document: any) {
    return await this.client.collections(collection).documents(id).update(document);
  }

  async deleteDocument(collection: string, id: string) {
    return await this.client.collections(collection).documents(id).delete();
  }

  async search(collection: string, query: string, options: any = {}) {
    return await this.client.collections(collection).documents().search({
      q: query,
      ...options
    });
  }

  async searchItems(query: string, limit = 20) {
    return await this.search('items', query, {
      query_by: 'title,description,tags',
      per_page: limit
    });
  }

  async searchByCategory(category: string, limit = 20) {
    return await this.search('items', '', {
      filter_by: `category:=${category}`,
      per_page: limit
    });
  }

  async searchByTag(tag: string, limit = 20) {
    return await this.search('items', '', {
      filter_by: `tags:=${tag}`,
      per_page: limit
    });
  }

  async createCollection(schema: any) {
    return await this.client.collections().create(schema);
  }

  async getCollection(collection: string) {
    return await this.client.collections(collection).retrieve();
  }

  async listCollections() {
    return await this.client.collections().retrieve();
  }
}

export default TypesenseService;
