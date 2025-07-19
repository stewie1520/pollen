import { DomainEvent } from 'src/shared/ddd';

export class ListingVariantDeletedFromChannelEvent extends DomainEvent {
  constructor(
    public readonly listingVariantId: string,
    public readonly listingChannelId: string,
  ) {
    super();
  }
}
