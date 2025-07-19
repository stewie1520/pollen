import {
  CommandHandler,
  EventBus,
  ICommand,
  ICommandHandler,
} from '@nestjs/cqrs';
import { ListingChannel } from 'src/core/domain/entities/listing-channel';
import { SaleChannelEnum } from 'src/core/domain/enums';
import {
  ListingVariantAlreadyInOtherChannelError,
  LmsCompanyNotFoundError,
} from 'src/core/domain/errors';
import { ListingChannelCreatedEvent } from 'src/core/domain/events/listing-channel-created.event';

import { ListingChannelRepository } from '../../repositories/listing-channel.repository';

export class CreateListingChannelCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly salesChannel: SaleChannelEnum,
    public readonly lmsCompanyId: string,
    public readonly listingVariantIds: string[],
  ) {}
}

@CommandHandler(CreateListingChannelCommand)
export class CreateListingChannelCommandHandler
  implements ICommandHandler<CreateListingChannelCommand, string>
{
  constructor(
    private readonly listingChannelRepository: ListingChannelRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateListingChannelCommand) {
    const [company, variants] = await Promise.all([
      this.listingChannelRepository.findLmsCompany(command.lmsCompanyId),
      this.listingChannelRepository.findListingVariantsByIds(
        command.listingVariantIds,
      ),
    ]);

    if (!company) {
      throw new LmsCompanyNotFoundError(command.lmsCompanyId);
    }

    if (variants.some((variant) => variant.listingChannelId)) {
      throw new ListingVariantAlreadyInOtherChannelError(
        command.listingVariantIds,
      );
    }

    const listingChannel = ListingChannel.create({
      name: command.name,
      salesChannel: command.salesChannel,
      lmsCompany: company.getProps(),
      listingVariants: variants.map((variant) => variant.getProps()),
      updatedBy: 'system', // we ignore the updatedBy field for now
      createdBy: 'system',
    });

    await this.listingChannelRepository.save(listingChannel);
    this.eventBus.publish(new ListingChannelCreatedEvent(listingChannel.id));

    return listingChannel.id;
  }
}
