import { Listing, ListingProps } from '../entities/listing';
import { ListingStatusEnum } from '../enums';
import { generateSubCategory } from './generate-sub-category';

export const generateListing = (
  partials: Partial<ListingProps> = {},
): Listing => {
  return Listing.create({
    ...partials,
    listingNo: 'LST-001',
    status: ListingStatusEnum.ACTIVE,
    subCategory: generateSubCategory(partials.subCategory).getProps(),
  });
};
