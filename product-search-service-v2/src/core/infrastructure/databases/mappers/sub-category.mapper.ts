import { SubCategory } from 'src/core/domain/entities/sub-category';
import { SubCategoryModel } from '../models';
import { CategoryMapper } from './category.mapper';

export class SubCategoryMapper {
  private readonly categoryMapper: CategoryMapper;

  constructor() {
    this.categoryMapper = new CategoryMapper();
  }

  fromEntityToModel = (entity: SubCategory): SubCategoryModel => {
    return new SubCategoryModel({
      id: entity.id,
      name: entity.name,
      category: this.categoryMapper.fromEntityToModel(entity.category),
    });
  };

  fromModelToEntity = (model: SubCategoryModel): SubCategory => {
    return SubCategory.create({
      id: model.id,
      name: model.name,
      category: this.categoryMapper
        .fromModelToEntity(model.category)
        .getProps(),
    });
  };
}
