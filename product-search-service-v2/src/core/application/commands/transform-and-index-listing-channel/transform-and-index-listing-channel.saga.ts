import { ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { ListingChannelCreatedEvent } from 'src/core/domain/events/listing-channel-created.event';
import { ListingVariantDeletedFromChannelEvent } from 'src/core/domain/events/listing-variant-deleted-from-channel.event';
import { ListingVariantNameUpdatedEvent } from 'src/core/domain/events/listing-variant-name-updated.event';
import { DomainEvent } from 'src/shared/ddd';
import { TransformAndIndexListingChannelCommand } from './transform-and-index-listing-channel.command';

export class TransformAndIndexListingChannelSaga {
  @Saga()
  listingChannelChanged(events: Observable<DomainEvent>) {
    return events.pipe(
      ofType(
        ListingChannelCreatedEvent,
        ListingVariantNameUpdatedEvent,
        ListingVariantDeletedFromChannelEvent,
      ),
      map((event) => new TransformAndIndexListingChannelCommand(event)),
    );
  }
}
