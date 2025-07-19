import { SubCategory, SubCategoryProps } from '../entities/sub-category';
import { generateCategory } from './generate-category';

export const generateSubCategory = (
  partials: Partial<SubCategoryProps> = {},
): SubCategory => {
  return SubCategory.create({
    name: 'Face Cleansers',
    category: generateCategory({
      ...partials.category,
      name: 'SKIN_CARE',
    }).getProps(),
    ...partials,
  });
};
