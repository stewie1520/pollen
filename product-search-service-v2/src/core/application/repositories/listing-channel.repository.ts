import { ListingChannel } from 'src/core/domain/entities/listing-channel';
import { ListingVariant } from 'src/core/domain/entities/listing-variant';
import { LmsCompany } from 'src/core/domain/entities/lms-company';
import { Repository } from 'src/shared/ddd';

export abstract class ListingChannelRepository extends Repository<ListingChannel> {
  abstract findLmsCompany(companyId: string): Promise<LmsCompany | undefined>;
  abstract findListingVariantsByIds(
    listingVariantIds: string[],
  ): Promise<ListingVariant[]>;
  abstract findListingVariantById(
    listingVariantId: string,
  ): Promise<ListingVariant | undefined>;
  abstract updateListingVariant(variant: ListingVariant): Promise<void>;
  abstract update(channel: ListingChannel): Promise<void>;
}
