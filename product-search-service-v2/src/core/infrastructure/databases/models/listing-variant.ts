import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ListingModel } from './listing';
import { BatchModel } from './warehouses';
import { ListingChannelModel } from './listing-channel';

@Entity()
@Index('idx_listing_variant_sku', ['sku'])
@Index('idx_listing_variant_name', ['variantName'])
export class ListingVariantModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sku: string;

  @Column()
  variantName: string;

  @Column()
  imageId: string;

  @ManyToOne(() => ListingModel, (listing) => listing.variants)
  @JoinColumn({ name: 'listing_id' })
  listing: ListingModel;

  @Column({ name: 'listing_id' })
  listingId: string;

  @ManyToOne(() => ListingChannelModel)
  @JoinColumn({ name: 'listing_channel_id' })
  listingChannel?: ListingChannelModel | null;

  @Column({ name: 'listing_channel_id', nullable: true })
  listingChannelId?: string | null;

  @OneToMany(() => BatchModel, (batch) => batch.listingVariant)
  batches: BatchModel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    data?: Omit<
      Partial<ListingVariantModel>,
      'listingChannel' | 'createdAt' | 'updatedAt'
    >,
  ) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
