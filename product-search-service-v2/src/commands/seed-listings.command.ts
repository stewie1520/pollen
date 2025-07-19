import { randomUUID } from 'crypto';
import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';
import { ListingStatusEnum } from '../core/domain/enums';
import {
  CategoryModel,
  ListingModel,
  ListingVariantModel,
  LmsCompanyModel,
  SubCategoryModel,
} from '../core/infrastructure/databases/models';

@Command({
  name: 'seed-listings',
  description: 'Seed listings, variants and related entities',
})
export class SeedListingsCommand extends CommandRunner {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.getRepository(LmsCompanyModel).save(
          new LmsCompanyModel({
            name: 'Pollen',
          }),
        );

        console.log('✅ LMS company seeded');

        const categories = [
          {
            name: 'Electronics',
            subCategories: ['Smartphones', 'Laptops'],
          },
          {
            name: 'Fashion',
            subCategories: ["Men's Clothing", "Women's Clothing"],
          },
          {
            name: 'Home & Living',
            subCategories: ['Furniture', 'Kitchenware'],
          },
        ];

        const categoryRepo = manager.getRepository(CategoryModel);
        const subCategoryRepo = manager.getRepository(SubCategoryModel);
        const subCategories: SubCategoryModel[] = [];

        for (const categoryData of categories) {
          const category = await categoryRepo.save(
            new CategoryModel({
              name: categoryData.name,
              createdBy: 'system',
              updatedBy: 'system',
            }),
          );

          for (const subCategoryName of categoryData.subCategories) {
            const subCategory = await subCategoryRepo.save(
              new SubCategoryModel({
                name: subCategoryName,
                category,
                createdBy: 'system',
                updatedBy: 'system',
              }),
            );

            subCategories.push(subCategory);
          }
        }

        console.log('✅ Category and subcategory seeded');

        const productsBySubCategory: Record<
          string,
          { name: string; variants: string[] }[]
        > = {
          Smartphones: [
            { name: 'Premium Smartphone', variants: ['128GB', '256GB'] },
            { name: 'Budget Smartphone', variants: ['64GB', '128GB'] },
          ],
          Laptops: [
            { name: 'Gaming Laptop', variants: ['16GB RAM', '32GB RAM'] },
            { name: 'Ultrabook', variants: ['8GB RAM', '16GB RAM'] },
          ],
          "Men's Clothing": [
            { name: 'Casual Shirt', variants: ['S', 'M', 'L'] },
            { name: 'Chino Pants', variants: ['30x32', '32x32', '34x32'] },
          ],
          "Women's Clothing": [
            { name: 'Summer Dress', variants: ['S', 'M', 'L'] },
            { name: 'Denim Jacket', variants: ['XS', 'S', 'M'] },
          ],
          Furniture: [
            { name: 'Coffee Table', variants: ['Walnut', 'Oak'] },
            { name: 'Bookshelf', variants: ['Black', 'White'] },
          ],
          Kitchenware: [
            { name: 'Non-stick Pan Set', variants: ['3-Piece', '5-Piece'] },
            { name: 'Knife Set', variants: ['6-Piece', '12-Piece'] },
          ],
        };

        const listingRepository = manager.getRepository(ListingModel);
        const listingVariantRepository =
          manager.getRepository(ListingVariantModel);

        let productCount = 0;
        for (const subCategory of subCategories) {
          for (const product of productsBySubCategory[subCategory.name]) {
            productCount++;

            const listing = await listingRepository.save(
              new ListingModel({
                listingNo: `LST-${productCount.toString().padStart(3, '0')}`,
                subCategory,
                status: ListingStatusEnum.ACTIVE,
              }),
            );

            let skuCount = 0;
            for (const variant of product.variants) {
              await listingVariantRepository.save(
                new ListingVariantModel({
                  sku: `SKU-${productCount.toString().padStart(3, '0')}-${(skuCount++).toString().padStart(3, '0')}`,
                  variantName: `${product.name} - ${variant}`,
                  imageId: randomUUID(),
                  listing: listing,
                  listingId: listing.id,
                  batches: [],
                }),
              );
            }
          }
        }
        console.log('✅ Listings and variants seeded');
      });
    } catch (error) {
      console.error('Error seeding listings:', error);
    }
  }
}
