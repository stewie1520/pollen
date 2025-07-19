import { Category, CategoryProps } from '../entities/category';

export const generateCategory = (category: Partial<CategoryProps> = {}) =>
  Category.create({
    ...category,
    name: 'SKIN_CARE',
  });
