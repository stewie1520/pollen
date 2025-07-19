import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ListingChannelNotFoundError } from 'src/core/domain/errors';
import { ListingChannelCreatedEvent } from 'src/core/domain/events/listing-channel-created.event';
import { ListingVariantDeletedFromChannelEvent } from 'src/core/domain/events/listing-variant-deleted-from-channel.event';
import { ListingVariantNameUpdatedEvent } from 'src/core/domain/events/listing-variant-name-updated.event';
import { ListingChannel } from '../../../domain/entities/listing-channel';
import { ListingChannelRepository } from '../../repositories/listing-channel.repository';
import { SearchService } from '../../services/search.service';

export class TransformAndIndexListingChannelCommand implements ICommand {
  constructor(
    public readonly event:
      | ListingChannelCreatedEvent
      | ListingVariantNameUpdatedEvent
      | ListingVariantDeletedFromChannelEvent,
  ) {}
}

@CommandHandler(TransformAndIndexListingChannelCommand)
export class TransformAndIndexListingChannelCommandHandler
  implements ICommandHandler<TransformAndIndexListingChannelCommand>
{
  constructor(
    private readonly listingChannelRepository: ListingChannelRepository,
    private readonly searchService: SearchService,
  ) {}

  async execute(
    command: TransformAndIndexListingChannelCommand,
  ): Promise<void> {
    const { event } = command;

    if (event instanceof ListingChannelCreatedEvent) {
      await this.handleListingChannelCreatedEvent(event);
      return;
    }

    if (event instanceof ListingVariantNameUpdatedEvent) {
      await this.handleListingVariantNameUpdatedEvent(event);
      return;
    }

    if (event instanceof ListingVariantDeletedFromChannelEvent) {
      await this.handleListingVariantDeletedFromChannelEvent(event);
      return;
    }
  }

  private async indexListingChannel(listingChannel: ListingChannel) {
    await this.searchService.indexListingChannel({
      id: listingChannel.id,
      channel_listing_name: listingChannel.name,
      sales_channel: listingChannel.salesChannel,
      lms_company_id: listingChannel.lmsCompany.id,
      updated_by: listingChannel.updatedBy,
      listings: listingChannel.listingVariants.map((variant) => ({
        var_listing_id: variant.id,
        listing_no: variant.listing.listingNo,
        listing_status: variant.listing.status,
        sku: variant.sku,
        variant_name: variant.variantName,
        category_id: variant.listing.subCategory.category.id,
        category_name: variant.listing.subCategory.category.name,
        sub_category_id: variant.listing.subCategory.id,
        sub_category_name: variant.listing.subCategory.name,
        image: variant.imageId,
        batches: variant.batches.map((batch) => ({
          batch_id: batch.id,
          batch_no: batch.batchNo,
          batch_image: batch.batchImageId,
          pkg_qty: batch.pkgQty,
          pkg_type: batch.pkgType,
          retail_price_per_pkg: batch.retailPricePerPkg,
          unit_per_pkg: batch.unitPerPkg,
          currency_code: batch.currencyCode,
          retail_price_per_unit: batch.retailPricePerUnit,
          list_price_per_pkg: batch.listPricePerPkg,
          list_price_per_unit: batch.listPricePerUnit,
          batch_discount: batch.batchDiscount,
          expiry_date: batch.expiryDate.toISOString(),
          warehouse_id: batch.warehouse.id,
          warehouse_name: batch.warehouse.name,
          warehouse_country: batch.warehouse.country.name,
          warehouse_country_id: batch.warehouse.country.id,
          status: batch.status,
          batch_created_at: batch.createdAt,
          batch_updated_at: batch.updatedAt,
          batch_updated_by: batch.updatedBy,
          batch_created_by: batch.createdBy,
        })),
      })),
    });
  }

  private async handleListingChannelCreatedEvent(
    event: ListingChannelCreatedEvent,
  ): Promise<void> {
    const listingChannel = await this.listingChannelRepository.findOne(
      event.listingChannelId,
    );

    if (!listingChannel) {
      throw new ListingChannelNotFoundError(event.listingChannelId);
    }

    await this.indexListingChannel(listingChannel);
  }

  private async handleListingVariantNameUpdatedEvent(
    event: ListingVariantNameUpdatedEvent,
  ): Promise<void> {
    if (!event.listingChannelId) {
      return;
    }

    await this.searchService.deleteListingChannel(event.listingChannelId);

    const listingChannel = await this.listingChannelRepository.findOne(
      event.listingChannelId,
    );

    if (!listingChannel) {
      throw new ListingChannelNotFoundError(event.listingChannelId);
    }

    await this.indexListingChannel(listingChannel);
  }

  private async handleListingVariantDeletedFromChannelEvent(
    event: ListingVariantDeletedFromChannelEvent,
  ): Promise<void> {
    await this.searchService.deleteListingChannel(event.listingChannelId);

    const listingChannel = await this.listingChannelRepository.findOne(
      event.listingChannelId,
    );

    if (!listingChannel) {
      throw new ListingChannelNotFoundError(event.listingChannelId);
    }

    await this.indexListingChannel(listingChannel);
  }
}
