import { Batch } from 'src/core/domain/entities/warehouses/batch';
import { BatchModel } from '../models';
import { WarehouseMapper } from './warehouse.mapper';

export class BatchMapper {
  private readonly warehouseMapper: WarehouseMapper;

  constructor() {
    this.warehouseMapper = new WarehouseMapper();
  }

  fromEntityToModel = (entity: Batch): BatchModel => {
    return new BatchModel({
      id: entity.id,
      batchNo: entity.batchNo,
      batchImageId: entity.batchImageId,
      pkgQty: entity.pkgQty,
      pkgType: entity.pkgType,
      retailPricePerPkg: entity.retailPricePerPkg,
      unitPerPkg: entity.unitPerPkg,
      currencyCode: entity.currencyCode,
      retailPricePerUnit: entity.retailPricePerUnit,
      listPricePerPkg: entity.listPricePerPkg,
      listPricePerUnit: entity.listPricePerUnit,
      batchDiscount: entity.batchDiscount,
      expiryDate: entity.expiryDate,
      status: entity.status,
      warehouse: this.warehouseMapper.fromEntityToModel(entity.warehouse),
      warehouseId: entity.warehouse.id,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
  };

  fromModelToEntity = (model: BatchModel): Batch => {
    return Batch.create({
      id: model.id,
      batchNo: model.batchNo,
      batchImageId: model.batchImageId,
      pkgQty: model.pkgQty,
      pkgType: model.pkgType,
      retailPricePerPkg: model.retailPricePerPkg,
      unitPerPkg: model.unitPerPkg,
      currencyCode: model.currencyCode,
      retailPricePerUnit: model.retailPricePerUnit,
      listPricePerPkg: model.listPricePerPkg,
      listPricePerUnit: model.listPricePerUnit,
      batchDiscount: model.batchDiscount,
      expiryDate: new Date(model.expiryDate),
      status: model.status,
      warehouse: this.warehouseMapper
        .fromModelToEntity(model.warehouse)
        .getProps(),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      createdBy: model.createdBy,
      updatedBy: model.updatedBy,
    });
  };
}
