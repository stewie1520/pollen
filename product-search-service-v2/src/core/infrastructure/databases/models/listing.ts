import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ListingStatusEnum } from '../../../domain/enums';
import { ListingVariantModel } from './listing-variant';
import { SubCategoryModel } from './sub-category';

@Entity()
export class ListingModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  listingNo: string;

  @Column({
    type: 'enum',
    enum: ListingStatusEnum,
  })
  status: ListingStatusEnum;

  @ManyToOne(() => SubCategoryModel)
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategoryModel;

  @Column({ name: 'sub_category_id' })
  subCategoryId: string;

  @OneToMany(() => ListingVariantModel, (variant) => variant.listing)
  variants: ListingVariantModel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(data?: Omit<Partial<ListingModel>, 'createdAt' | 'updatedAt'>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
