import { randomUUID } from 'crypto';
import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';
import {
  BatchStatusEnum,
  CurrencyCodeEnum,
  PackageTypeEnum,
} from '../core/domain/enums';
import {
  BatchModel,
  CountryModel,
  ListingVariantModel,
  WarehouseModel,
} from '../core/infrastructure/databases/models';

@Command({
  name: 'seed-batches',
  description: 'Seed batches for variants',
})
export class SeedBatchesCommand extends CommandRunner {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const country = await manager.getRepository(CountryModel).save(
          new CountryModel({
            name: 'Singapore',
          }),
        );

        console.log('✅ Country seeded');

        const warehouse = await manager.getRepository(WarehouseModel).save(
          new WarehouseModel({
            name: 'Warehouse 1',
            country,
          }),
        );

        console.log('✅ Warehouse seeded');

        const variants = await manager
          .getRepository(ListingVariantModel)
          .find();

        for (const variant of variants) {
          await manager.getRepository(BatchModel).save(
            new BatchModel({
              batchNo: `BATCH-${randomUUID().slice(0, 8)}`,
              batchImageId: randomUUID(),
              listingVariant: variant,
              listingVariantId: variant.id,
              pkgQty: Math.floor(Math.random() * 100) + 1,
              pkgType: PackageTypeEnum.CARTON,
              retailPricePerPkg: Math.floor(Math.random() * 100) + 1,
              unitPerPkg: Math.floor(Math.random() * 100) + 1,
              currencyCode: CurrencyCodeEnum.SGD,
              retailPricePerUnit: Math.floor(Math.random() * 100) + 1,
              listPricePerPkg: Math.floor(Math.random() * 100) + 1,
              listPricePerUnit: Math.floor(Math.random() * 100) + 1,
              batchDiscount: Math.random(),
              expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              status: BatchStatusEnum.ACTIVE,
              warehouse,
              warehouseId: warehouse.id,
              createdBy: 'system',
              updatedBy: 'system',
            }),
          );
        }
        console.log('✅ Batches seeded');
      });
    } catch (error) {
      console.error('Error seeding batches:', error);
    }
  }
}
