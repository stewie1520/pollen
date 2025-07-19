import { AggregateRoot, EntityProps } from 'src/shared/ddd';

import { SaleChannelEnum } from '../enums';
import { ListingVariant, ListingVariantProps } from './listing-variant';
import { LmsCompany, LmsCompanyProps } from './lms-company';
import { ListingVariantDeletedFromChannelEvent } from '../events/listing-variant-deleted-from-channel.event';

export interface ListingChannelProps extends EntityProps {
  name: string;
  salesChannel: SaleChannelEnum;
  lmsCompany: LmsCompanyProps;
  updatedBy: string;
  createdBy: string;
  listingVariants: ListingVariantProps[];
}

export class ListingChannel extends AggregateRoot<ListingChannelProps> {
  private lmsCompanyEntity: LmsCompany;
  private listingVariantEntities: ListingVariant[];

  private constructor(props: ListingChannelProps) {
    super(props);

    this.lmsCompanyEntity = LmsCompany.create(props.lmsCompany);
    this.listingVariantEntities = props.listingVariants.map(
      (listingVariantProps) => ListingVariant.create(listingVariantProps),
    );
  }

  get name() {
    return this.props.name;
  }

  get salesChannel() {
    return this.props.salesChannel;
  }

  get lmsCompany() {
    return this.lmsCompanyEntity;
  }

  get updatedBy() {
    return this.props.updatedBy;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get listingVariants() {
    return this.listingVariantEntities;
  }

  deleteListingVariant(listingVariant: ListingVariant): void {
    this.listingVariantEntities = this.listingVariantEntities.filter(
      (variant) => variant.id !== listingVariant.id,
    );

    this.apply(
      new ListingVariantDeletedFromChannelEvent(listingVariant.id, this.id),
    );
  }

  static create(props: ListingChannelProps): ListingChannel {
    return new ListingChannel(props);
  }
}
