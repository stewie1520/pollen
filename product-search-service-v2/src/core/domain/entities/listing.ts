import { Entity, EntityProps } from 'src/shared/ddd';

import { ListingStatusEnum } from '../enums';
import { SubCategory, SubCategoryProps } from './sub-category';

export interface ListingProps extends EntityProps {
  listingNo: string;
  status: ListingStatusEnum;
  subCategory: SubCategoryProps;
}

export class Listing extends Entity<ListingProps> {
  private subCategoryEntity: SubCategory;

  private constructor(props: ListingProps) {
    super(props);

    this.subCategoryEntity = SubCategory.create(props.subCategory);
  }

  get listingNo() {
    return this.props.listingNo;
  }

  get status() {
    return this.props.status;
  }

  get subCategory() {
    return this.subCategoryEntity;
  }

  static create(props: ListingProps): Listing {
    return new Listing(props);
  }
}
