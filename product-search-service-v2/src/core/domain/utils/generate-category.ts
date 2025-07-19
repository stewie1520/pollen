import { Category, CategoryProps } from '../entities/category';

export const generateCategory = (category: Partial<CategoryProps> = {}) =>
  Category.create({
    name: 'SKIN_CARE',
    ...category,
  });
