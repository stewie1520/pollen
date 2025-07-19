import { Entity, EntityProps } from 'src/shared/ddd';

export interface CategoryProps extends EntityProps {
  name: string;
}

export class Category extends Entity<CategoryProps> {
  private constructor(props: CategoryProps) {
    super(props);
  }

  get name() {
    return this.props.name;
  }

  static create(props: CategoryProps) {
    return new Category(props);
  }
}
