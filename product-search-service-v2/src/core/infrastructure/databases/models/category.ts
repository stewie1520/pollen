import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubCategoryModel } from './sub-category';

@Entity()
export class CategoryModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => SubCategoryModel, (subCategory) => subCategory.category)
  subCategories: SubCategoryModel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    data?: Omit<
      Partial<CategoryModel>,
      'subCategories' | 'updatedAt' | 'createdAt'
    >,
  ) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
