import { ListingVariant } from 'src/core/domain/entities/listing-variant';
import { ListingVariantModel } from '../models';
import { BatchMapper } from './batch.mapper';
import { ListingMapper } from './listing.mapper';

export class ListingVariantMapper {
  private readonly batchMapper: BatchMapper;
  private readonly listingMapper: ListingMapper;

  constructor() {
    this.batchMapper = new BatchMapper();
    this.listingMapper = new ListingMapper();
  }

  fromEntityToModel = (entity: ListingVariant): ListingVariantModel => {
    return new ListingVariantModel({
      id: entity.id,
      sku: entity.sku,
      variantName: entity.variantName,
      imageId: entity.imageId,
      listing: this.listingMapper.fromEntityToModel(entity.listing),
      listingId: entity.listing.id,
      listingChannelId: entity.listingChannelId ?? null,
      batches: entity.batches.map((batch) =>
        this.batchMapper.fromEntityToModel(batch),
      ),
    });
  };

  fromModelToEntity = (model: ListingVariantModel): ListingVariant => {
    const batches =
      model.batches?.map((batch) =>
        this.batchMapper.fromModelToEntity(batch).getProps(),
      ) || [];

    return ListingVariant.create({
      id: model.id,
      sku: model.sku,
      variantName: model.variantName,
      imageId: model.imageId,
      batches,
      listing: this.listingMapper.fromModelToEntity(model.listing).getProps(),
      listingChannelId: model.listingChannelId ?? undefined,
    });
  };
}
