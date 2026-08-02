// Algolia client for trove

import algoliasearch from 'algoliasearch';

class AlgoliaService {
  private client: any;

  constructor(appId: string, apiKey: string) {
    this.client = algoliasearch(appId, apiKey);
  }

  getIndex(indexName: string) {
    return this.client.initIndex(indexName);
  }

  async indexDocument(indexName: string, document: any) {
    const index = this.getIndex(indexName);
    return await index.saveObject(document);
  }

  async updateDocument(indexName: string, document: any) {
    const index = this.getIndex(indexName);
    return await index.partialUpdateObject(document);
  }

  async deleteDocument(indexName: string, objectId: string) {
    const index = this.getIndex(indexName);
    return await index.deleteObject(objectId);
  }

  async search(indexName: string, query: string, options: any = {}) {
    const index = this.getIndex(indexName);
    return await index.search(query, options);
  }

  async searchItems(query: string, limit = 20) {
    return await this.search('items', query, {
      hitsPerPage: limit,
      attributesToHighlight: ['title', 'description']
    });
  }

  async searchByCategory(category: string, limit = 20) {
    return await this.search('items', '', {
      filters: `category:${category}`,
      hitsPerPage: limit
    });
  }

  async searchByTag(tag: string, limit = 20) {
    return await this.search('items', '', {
      filters: `tags:${tag}`,
      hitsPerPage: limit
    });
  }

  async configureIndex(indexName: string, settings: any) {
    const index = this.getIndex(indexName);
    return await index.setSettings(settings);
  }

  async configureItemIndex() {
    return await this.configureIndex('items', {
      searchableAttributes: ['title', 'description', 'tags'],
      attributesForFaceting: ['category', 'tags'],
      customRanking: ['desc(price)'],
      ranking: ['typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom']
    });
  }

  async batchIndex(indexName: string, documents: any[]) {
    const index = this.getIndex(indexName);
    return await index.saveObjects(documents);
  }

  async clearIndex(indexName: string) {
    const index = this.getIndex(indexName);
    return await index.clearObjects();
  }
}

export default AlgoliaService;
