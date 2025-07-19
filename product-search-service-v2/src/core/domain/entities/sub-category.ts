import { Entity, EntityProps } from 'src/shared/ddd';
import { Category, CategoryProps } from './category';

export interface SubCategoryProps extends EntityProps {
  name: string;
  category: CategoryProps;
}

export class SubCategory extends Entity<SubCategoryProps> {
  private categoryEntity: Category;

  private constructor(props: SubCategoryProps) {
    super(props);

    this.categoryEntity = Category.create(props.category);
  }

  get name() {
    return this.props.name;
  }

  get category() {
    return this.categoryEntity;
  }

  static create(props: SubCategoryProps) {
    return new SubCategory(props);
  }
}
