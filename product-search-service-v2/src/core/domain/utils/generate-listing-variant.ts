import {
  ListingVariant,
  ListingVariantProps,
} from '../entities/listing-variant';
import { generateBatch } from './generate-batch';
import { generateListing } from './generate-listing';

export const generateListingVariant = (
  partials: Partial<ListingVariantProps> = {},
): ListingVariant => {
  return ListingVariant.create({
    ...partials,
    sku: 'SKU-001',
    variantName: 'Default Variant',
    imageId: 'variant-image-123',
    batches: [generateBatch().getProps()],
    listing: generateListing().getProps(),
    listingChannelId: undefined,
  });
};
