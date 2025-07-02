import { Kafka } from "kafkajs";
import type { Producer } from "kafkajs";

import { env } from "../env";
import { PublisherService } from "./publisher.service";

export class KafkaPublisherService extends PublisherService {
  private static instance: KafkaPublisherService;
  private producer: Producer | null = null;

  private constructor() {
    super();
  }

  public static getInstance(): KafkaPublisherService {
    if (!KafkaPublisherService.instance) {
      KafkaPublisherService.instance = new KafkaPublisherService();
    }

    return KafkaPublisherService.instance;
  }

  private async getProducer(): Promise<Producer> {
    if (!this.producer) {
      const kafka = new Kafka({
        clientId: "product-search-service",
        brokers: [`${env.KAFKA_BROKER_HOST}:${env.KAFKA_BROKER_PORT}`],
      });

      this.producer = kafka.producer();
      await this.producer.connect();
    }

    return this.producer;
  }

  public async publish(topic: string, message: object): Promise<void> {
    const producer = await this.getProducer();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
