import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LmsCompanyModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    data?: Omit<Partial<LmsCompanyModel>, 'createdAt' | 'updatedAt'>,
  ) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
