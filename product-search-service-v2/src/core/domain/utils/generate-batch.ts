import { Batch, BatchProps } from '../entities/warehouses/batch';
import { BatchStatusEnum, CurrencyCodeEnum, PackageTypeEnum } from '../enums';
import { generateWarehouse } from './generate-warehouse';

export const generateBatch = (partials: Partial<BatchProps> = {}): Batch => {
  return Batch.create({
    ...partials,
    batchNo: 'BATCH-001',
    batchImageId: 'image-123',
    pkgQty: 100,
    pkgType: PackageTypeEnum.CARTON,
    retailPricePerPkg: 25.99,
    unitPerPkg: 1,
    currencyCode: CurrencyCodeEnum.SGD,
    retailPricePerUnit: 25.99,
    listPricePerPkg: 29.99,
    listPricePerUnit: 29.99,
    batchDiscount: 0.1,
    expiryDate: new Date('2025-12-31'),
    status: BatchStatusEnum.ACTIVE,
    warehouse: generateWarehouse(partials.warehouse).getProps(),
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: 'system',
    createdBy: 'system',
  });
};
