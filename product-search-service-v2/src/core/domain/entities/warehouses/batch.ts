import { Entity, EntityProps } from 'src/shared/ddd';

import {
  BatchStatusEnum,
  CurrencyCodeEnum,
  PackageTypeEnum,
} from '../../enums';
import { Warehouse, WarehouseProps } from './warehouse';

export interface BatchProps extends EntityProps {
  batchNo: string;
  batchImageId: string;
  pkgQty: number;
  pkgType: PackageTypeEnum;
  retailPricePerPkg: number;
  unitPerPkg: number;
  currencyCode: CurrencyCodeEnum;
  retailPricePerUnit: number;
  listPricePerPkg: number;
  listPricePerUnit: number;
  batchDiscount: number;
  expiryDate: Date;
  status: BatchStatusEnum;

  warehouse: WarehouseProps;

  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  createdBy: string;
}

export class Batch extends Entity<BatchProps> {
  public warehouseEntity: Warehouse;

  private constructor(props: BatchProps) {
    super(props);

    this.warehouseEntity = Warehouse.create(props.warehouse);
  }

  get batchNo() {
    return this.props.batchNo;
  }

  get warehouse() {
    return this.warehouseEntity;
  }

  get batchImageId() {
    return this.props.batchImageId;
  }

  get pkgQty() {
    return this.props.pkgQty;
  }

  get pkgType() {
    return this.props.pkgType;
  }

  get retailPricePerPkg() {
    return this.props.retailPricePerPkg;
  }

  get unitPerPkg() {
    return this.props.unitPerPkg;
  }

  get currencyCode() {
    return this.props.currencyCode;
  }

  get retailPricePerUnit() {
    return this.props.retailPricePerUnit;
  }

  get listPricePerPkg() {
    return this.props.listPricePerPkg;
  }

  get listPricePerUnit() {
    return this.props.listPricePerUnit;
  }

  get batchDiscount() {
    return this.props.batchDiscount;
  }

  get expiryDate() {
    return this.props.expiryDate;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get updatedBy() {
    return this.props.updatedBy;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  static create(props: BatchProps) {
    return new Batch(props);
  }
}
