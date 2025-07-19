import {
  ListingChannel,
  ListingChannelProps,
} from '../entities/listing-channel';
import { SaleChannelEnum } from '../enums';
import { generateListingVariant } from './generate-listing-variant';
import { generateLmsCompany } from './generate-lms-company';

export const generateListingChannel = (
  partials: Partial<ListingChannelProps> = {},
): ListingChannel => {
  return ListingChannel.create({
    name: 'Default Listing Channel',
    salesChannel: SaleChannelEnum.MARKETPLACE,
    lmsCompany: generateLmsCompany(partials.lmsCompany).getProps(),
    listingVariants: [generateListingVariant().getProps()],
    updatedBy: 'system',
    createdBy: 'system',
    ...partials,
  });
};
