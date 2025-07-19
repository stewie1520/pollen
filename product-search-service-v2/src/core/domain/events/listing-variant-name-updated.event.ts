import { DomainEvent } from 'src/shared/ddd';

export class ListingVariantNameUpdatedEvent extends DomainEvent {
  constructor(
    public readonly listingVariantId: string,
    public readonly name: string,
    public readonly listingChannelId?: string,
  ) {
    super();
  }
}
