export abstract class PublisherService {
  abstract publish(topic: string, message: object): Promise<void>;
}
