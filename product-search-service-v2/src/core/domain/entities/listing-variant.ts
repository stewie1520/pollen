import { Entity, EntityProps } from 'src/shared/ddd';
import { Listing, ListingProps } from './listing';
import { Batch, BatchProps } from './warehouses/batch';

export interface ListingVariantProps extends EntityProps {
  sku: string;
  variantName: string;
  imageId: string;
  batches: BatchProps[];
  listing: ListingProps;
  listingChannelId?: string;
}

export class ListingVariant extends Entity<ListingVariantProps> {
  private readonly listingEntity: Listing;
  private readonly batchEntities: Batch[];

  private constructor(props: ListingVariantProps) {
    super(props);

    this.batchEntities = props.batches.map((batch) => Batch.create(batch));
    this.listingEntity = Listing.create(props.listing);
  }

  get sku() {
    return this.props.sku;
  }

  get variantName() {
    return this.props.variantName;
  }

  get imageId() {
    return this.props.imageId;
  }

  get batches() {
    return this.batchEntities;
  }

  get listing() {
    return this.listingEntity;
  }

  get listingChannelId() {
    return this.props.listingChannelId;
  }

  updateName(newName: string) {
    this.props.variantName = newName;
  }

  static create(props: ListingVariantProps) {
    return new ListingVariant(props);
  }
}
