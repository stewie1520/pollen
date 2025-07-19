import { DomainError } from 'src/shared/ddd';

export class ListingVariantAlreadyInOtherChannelError extends DomainError {
  constructor(variantIds: string[]) {
    super(`Listing variant(s) already in other channel(s).`, {
      variantIds,
    });
  }
}
