import {
  BatchStatusEnum,
  ListingStatusEnum,
  SaleChannelEnum,
} from 'src/core/domain/enums';

export abstract class SearchService {
  abstract initIndices(): Promise<void>;

  abstract indexListingChannel(
    input: IndexListingChannelDocument,
  ): Promise<void>;

  abstract deleteListingChannel(listingChannelId: string): Promise<void>;

  abstract searchListingChannel(
    query: string,
    page: number,
    limit: number,
  ): Promise<{
    total: number;
    data: IndexListingChannelDocument[];
  }>;
}

export type IndexListingChannelDocument = {
  id: string;
  channel_listing_name: string;
  sales_channel: SaleChannelEnum;
  lms_company_id: string;
  updated_by: string;

  listings: {
    var_listing_id: string;
    listing_no: string;
    listing_status: ListingStatusEnum;
    sku: string;
    variant_name: string;
    category_id: string;
    category_name: string;
    sub_category_id: string;
    sub_category_name: string;
    image: string;

    batches: {
      batch_id: string;
      batch_no: string;
      batch_image: string;
      pkg_qty: number;
      pkg_type: string;
      retail_price_per_pkg: number;
      unit_per_pkg: number;
      currency_code: string;
      retail_price_per_unit: number;
      list_price_per_pkg: number;
      list_price_per_unit: number;
      batch_discount: number;
      expiry_date: string;
      warehouse_id: string;
      warehouse_name: string;
      warehouse_country: string;
      warehouse_country_id: string;
      status: BatchStatusEnum;
      batch_created_at: Date;
      batch_updated_at: Date;
      batch_updated_by: string;
      batch_created_by: string;
    }[];
  }[];
};
