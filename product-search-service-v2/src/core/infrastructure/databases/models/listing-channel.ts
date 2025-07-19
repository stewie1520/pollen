import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SaleChannelEnum } from '../../../domain/enums';
import { ListingVariantModel } from './listing-variant';
import { LmsCompanyModel } from './lms-company';

@Entity()
@Index('idx_listing_channel_name', ['name'])
export class ListingChannelModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: SaleChannelEnum,
  })
  salesChannel: SaleChannelEnum;

  @ManyToOne(() => LmsCompanyModel)
  @JoinColumn({ name: 'lms_company_id' })
  lmsCompany: LmsCompanyModel;

  @Column({ name: 'lms_company_id' })
  lmsCompanyId: string;

  @OneToMany(() => ListingVariantModel, (variant) => variant.listingChannel)
  listingVariants: ListingVariantModel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;

  constructor(
    data?: Omit<Partial<ListingChannelModel>, 'createdAt' | 'updatedAt'>,
  ) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
