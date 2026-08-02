// Kafka consumer for trove

import { Kafka, Consumer, ConsumerRunConfig } from 'kafkajs';

class KafkaConsumer {
  private consumer: Consumer;
  private kafka: Kafka;

  constructor(brokers: string[], groupId: string) {
    this.kafka = new Kafka({
      clientId: 'trove-consumer',
      brokers
    });
    this.consumer = this.kafka.consumer({ groupId });
  }

  async connect() {
    await this.consumer.connect();
  }

  async disconnect() {
    await this.consumer.disconnect();
  }

  async subscribe(topic: string, fromBeginning = false) {
    await this.consumer.subscribe({ topic, fromBeginning });
  }

  async run(config: ConsumerRunConfig) {
    await this.consumer.run(config);
  }

  async consumeItemEvents(handler: (message: any) => Promise<void>) {
    await this.subscribe('item-events');
    await this.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (value) {
          const event = JSON.parse(value);
          await handler(event);
        }
      }
    });
  }

  async consumeSearchEvents(handler: (message: any) => Promise<void>) {
    await this.subscribe('search-events');
    await this.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (value) {
          const event = JSON.parse(value);
          await handler(event);
        }
      }
    });
  }

  async consumeViewEvents(handler: (message: any) => Promise<void>) {
    await this.subscribe('view-events');
    await this.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (value) {
          const event = JSON.parse(value);
          await handler(event);
        }
      }
    });
  }
}

export default KafkaConsumer;
