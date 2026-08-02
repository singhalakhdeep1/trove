// Kafka producer for trove

import { Kafka, Producer } from 'kafkajs';

class KafkaProducer {
  private producer: Producer;
  private kafka: Kafka;

  constructor(brokers: string[]) {
    this.kafka = new Kafka({
      clientId: 'trove-producer',
      brokers
    });
    this.producer = this.kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  async sendMessage(topic: string, message: any, key?: string) {
    await this.producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(message)
        }
      ]
    });
  }

  async sendItemCreated(item: any) {
    await this.sendMessage('item-events', {
      type: 'ITEM_CREATED',
      data: item
    }, item.id);
  }

  async sendItemUpdated(item: any) {
    await this.sendMessage('item-events', {
      type: 'ITEM_UPDATED',
      data: item
    }, item.id);
  }

  async sendItemDeleted(itemId: string) {
    await this.sendMessage('item-events', {
      type: 'ITEM_DELETED',
      data: { id: itemId }
    }, itemId);
  }

  async sendSearchEvent(query: string, userId?: string) {
    await this.sendMessage('search-events', {
      type: 'SEARCH',
      query,
      userId,
      timestamp: new Date().toISOString()
    });
  }

  async sendViewEvent(itemId: string, userId?: string) {
    await this.sendMessage('view-events', {
      type: 'ITEM_VIEWED',
      itemId,
      userId,
      timestamp: new Date().toISOString()
    });
  }
}

export default KafkaProducer;
