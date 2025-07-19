import {
  CommandHandler,
  EventBus,
  ICommand,
  ICommandHandler,
} from '@nestjs/cqrs';
import { ListingVariantNotFoundError } from 'src/core/domain/errors';
import { ListingVariantNameUpdatedEvent } from 'src/core/domain/events/listing-variant-name-updated.event';

import { ListingChannelRepository } from '../../repositories/listing-channel.repository';

export class UpdateListingVariantNameCommand implements ICommand {
  constructor(
    public readonly variantId: string,
    public readonly name: string,
  ) {}
}

@CommandHandler(UpdateListingVariantNameCommand)
export class UpdateListingVariantNameCommandHandler
  implements ICommandHandler<UpdateListingVariantNameCommand>
{
  constructor(
    private readonly listingChannelRepository: ListingChannelRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateListingVariantNameCommand): Promise<void> {
    const listingVariant =
      await this.listingChannelRepository.findListingVariantById(
        command.variantId,
      );

    if (!listingVariant) {
      throw new ListingVariantNotFoundError(command.variantId);
    }

    listingVariant.updateName(command.name);

    await this.listingChannelRepository.updateListingVariant(listingVariant);

    this.eventBus.publish(
      new ListingVariantNameUpdatedEvent(
        listingVariant.id,
        listingVariant.variantName,
        listingVariant.listingChannelId,
      ),
    );
  }
}
