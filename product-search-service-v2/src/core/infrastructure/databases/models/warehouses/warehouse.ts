import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CountryModel } from './country';
import { BatchModel } from './batch';

@Entity()
export class WarehouseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => CountryModel)
  @JoinColumn({ name: 'country_id' })
  country: CountryModel;

  @Column({ name: 'country_id' })
  countryId: string;

  @OneToMany(() => BatchModel, (batch) => batch.warehouse)
  batches: BatchModel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(data?: Omit<Partial<WarehouseModel>, 'updatedAt' | 'createdAt'>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
