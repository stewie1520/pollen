import { Listing } from 'src/core/domain/entities/listing';
import { ListingModel } from '../models';
import { SubCategoryMapper } from './sub-category.mapper';

export class ListingMapper {
  private readonly subCategoryMapper: SubCategoryMapper;

  constructor() {
    this.subCategoryMapper = new SubCategoryMapper();
  }

  fromEntityToModel = (entity: Listing): ListingModel => {
    return new ListingModel({
      id: entity.id,
      listingNo: entity.listingNo,
      status: entity.status,
      subCategory: this.subCategoryMapper.fromEntityToModel(entity.subCategory),
      subCategoryId: entity.subCategory.id,
    });
  };

  fromModelToEntity = (model: ListingModel): Listing => {
    return Listing.create({
      id: model.id,
      listingNo: model.listingNo,
      status: model.status,
      subCategory: this.subCategoryMapper
        .fromModelToEntity(model.subCategory)
        .getProps(),
    });
  };
}
