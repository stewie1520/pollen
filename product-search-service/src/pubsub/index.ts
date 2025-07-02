import { KafkaPublisherService } from "./kafka-publisher.service";
import type { PublisherService } from "./publisher.service";

const publisherService: PublisherService = KafkaPublisherService.getInstance();

export { publisherService };
