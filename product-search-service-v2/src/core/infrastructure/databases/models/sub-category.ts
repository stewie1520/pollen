import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryModel } from './category';

@Entity('sub_categories')
export class SubCategoryModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => CategoryModel, (category) => category.subCategories)
  @JoinColumn({ name: 'category_id' })
  category: CategoryModel;

  @Column({ name: 'category_id' })
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;

  constructor(
    data?: Omit<
      Partial<SubCategoryModel>,
      'categoryId' | 'createdAt' | 'updatedAt'
    >,
  ) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
