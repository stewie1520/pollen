import {
  CommandHandler,
  EventPublisher,
  ICommand,
  ICommandHandler,
} from '@nestjs/cqrs';
import {
  ListingChannelNotFoundError,
  ListingVariantNotFoundError,
} from 'src/core/domain/errors';

import { ListingChannelRepository } from '../../repositories/listing-channel.repository';

export class DeleteListingVariantFromChannelCommand implements ICommand {
  constructor(
    public readonly channelId: string,
    public readonly listingVariantId: string,
  ) {}
}

@CommandHandler(DeleteListingVariantFromChannelCommand)
export class DeleteListingVariantFromChannelCommandHandler
  implements ICommandHandler<DeleteListingVariantFromChannelCommand>
{
  constructor(
    private readonly listingChannelRepository: ListingChannelRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeleteListingVariantFromChannelCommand): Promise<any> {
    const [channel, listingVariant] = await Promise.all([
      this.listingChannelRepository.findOne(command.channelId),
      this.listingChannelRepository.findListingVariantById(
        command.listingVariantId,
      ),
    ]);

    if (!channel) {
      throw new ListingChannelNotFoundError(
        `Channel with id ${command.channelId} not found`,
      );
    }

    if (!listingVariant) {
      throw new ListingVariantNotFoundError(command.listingVariantId);
    }

    channel.mergeContext(this.eventPublisher);
    channel.deleteListingVariant(listingVariant);

    await this.listingChannelRepository.update(channel);
    channel.commit();
  }
}
