import { DomainEvent } from 'src/shared/ddd';

export class ListingChannelCreatedEvent extends DomainEvent {
  constructor(public readonly listingChannelId: string) {
    super();
  }
}
