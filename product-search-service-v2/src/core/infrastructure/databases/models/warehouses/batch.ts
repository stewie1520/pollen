import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  BatchStatusEnum,
  CurrencyCodeEnum,
  PackageTypeEnum,
} from '../../../../domain/enums';
import { WarehouseModel } from './warehouse';
import { ListingVariantModel } from '../listing-variant';

@Entity()
export class BatchModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  batchNo: string;

  @Column()
  batchImageId: string;

  @ManyToOne(() => ListingVariantModel, (variant) => variant.batches)
  @JoinColumn({ name: 'listing_variant_id' })
  listingVariant: ListingVariantModel;

  @Column({ name: 'listing_variant_id' })
  listingVariantId: string;

  @Column('int')
  pkgQty: number;

  @Column({
    type: 'enum',
    enum: PackageTypeEnum,
  })
  pkgType: PackageTypeEnum;

  @Column('decimal', { precision: 10, scale: 2 })
  retailPricePerPkg: number;

  @Column('int')
  unitPerPkg: number;

  @Column({
    type: 'enum',
    enum: CurrencyCodeEnum,
  })
  currencyCode: CurrencyCodeEnum;

  @Column('decimal', { precision: 10, scale: 2 })
  retailPricePerUnit: number;

  @Column('decimal', { precision: 10, scale: 2 })
  listPricePerPkg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  listPricePerUnit: number;

  @Column('decimal', { precision: 5, scale: 2 })
  batchDiscount: number;

  @Column('date')
  expiryDate: Date;

  @Column({
    type: 'enum',
    enum: BatchStatusEnum,
  })
  status: BatchStatusEnum;

  @ManyToOne(() => WarehouseModel, (warehouse) => warehouse.batches)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseModel;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;

  constructor(data?: Partial<BatchModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
