import { Category } from 'src/core/domain/entities/category';
import { CategoryModel } from '../models';

export class CategoryMapper {
  fromEntityToModel = (entity: Category): CategoryModel => {
    return new CategoryModel({
      id: entity.id,
      name: entity.name,
    });
  };

  fromModelToEntity = (model: CategoryModel): Category => {
    return Category.create({
      id: model.id,
      name: model.name,
    });
  };
}
