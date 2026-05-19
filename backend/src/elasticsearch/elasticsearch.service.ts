import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
    private client: Client;

    constructor(private configService: ConfigService) {
        this.client = new Client({
            node: this.configService.get('ELASTICSEARCH_NODE'),
        });
    }

    async onModuleInit() {
        try {
            await this.client.ping();
            console.log('✅ Elasticsearch connected');
            await this.createIndices();
        } catch (error) {
            console.error('❌ Elasticsearch connection failed:', error);
        }
    }

    private async createIndices() {
        // Create products index
        const productsExists = await this.client.indices.exists({
            index: 'products',
        });

        if (!productsExists) {
            await this.client.indices.create({
                index: 'products',
                body: {
                    mappings: {
                        properties: {
                            id: { type: 'keyword' },
                            name: { type: 'text' },
                            description: { type: 'text' },
                            price: { type: 'float' },
                            category: { type: 'keyword' },
                            tags: { type: 'keyword' },
                            rating: { type: 'float' },
                            createdAt: { type: 'date' },
                        },
                    },
                },
            });
        }

        // Create services index
        const servicesExists = await this.client.indices.exists({
            index: 'services',
        });

        if (!servicesExists) {
            await this.client.indices.create({
                index: 'services',
                body: {
                    mappings: {
                        properties: {
                            id: { type: 'keyword' },
                            name: { type: 'text' },
                            description: { type: 'text' },
                            price: { type: 'float' },
                            category: { type: 'keyword' },
                            rating: { type: 'float' },
                            createdAt: { type: 'date' },
                        },
                    },
                },
            });
        }
    }

    getClient(): Client {
        return this.client;
    }

    async indexDocument(index: string, id: string, body: any) {
        return this.client.index({
            index,
            id,
            body,
        });
    }

    async updateDocument(index: string, id: string, body: any) {
        return this.client.update({
            index,
            id,
            body: {
                doc: body,
            },
        });
    }

    async deleteDocument(index: string, id: string) {
        return this.client.delete({
            index,
            id,
        });
    }

    async search(index: string, query: any) {
        return this.client.search({
            index,
            body: query,
        });
    }

    async bulkIndex(index: string, documents: any[]) {
        const body = documents.flatMap((doc) => [
            { index: { _index: index, _id: doc.id } },
            doc,
        ]);

        return this.client.bulk({ body, refresh: true });
    }
}
