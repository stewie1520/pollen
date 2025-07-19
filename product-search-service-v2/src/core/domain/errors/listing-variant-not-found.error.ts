import { DomainError } from 'src/shared/ddd';

export class ListingVariantNotFoundError extends DomainError {
  constructor(listingVariantId: string) {
    super(`Listing variant with ID ${listingVariantId} not found`, {
      listingVariantId,
    });
  }
}
