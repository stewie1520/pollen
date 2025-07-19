import { Injectable } from '@nestjs/common';
import { ListingChannelRepository } from 'src/core/application/repositories/listing-channel.repository';
import { ListingChannel } from 'src/core/domain/entities/listing-channel';
import { ListingVariant } from 'src/core/domain/entities/listing-variant';
import { LmsCompany } from 'src/core/domain/entities/lms-company';
import {
  DatabaseOperationFailedError,
  TypeormRepository,
} from 'src/shared/ddd';
import { DataSource, In, Not } from 'typeorm';

import {
  ListingChannelMapper,
  ListingVariantMapper,
  LmsCompanyMapper,
} from '../databases/mappers';
import {
  ListingChannelModel,
  ListingVariantModel,
  LmsCompanyModel,
} from '../databases/models';

@Injectable()
export class SqlListingChannelRepository
  extends TypeormRepository<ListingChannel, ListingChannelModel>
  implements ListingChannelRepository
{
  private readonly mapper = new ListingChannelMapper();
  private readonly companyMapper = new LmsCompanyMapper();
  private readonly variantMapper = new ListingVariantMapper();

  protected modelToAggregateRoot = (model: ListingChannelModel) =>
    this.mapper.fromModelToEntity(model);

  protected aggregateRootToModel = (
    aggregate: ListingChannel,
  ): ListingChannelModel => this.mapper.fromEntityToModel(aggregate);

  constructor(datasource: DataSource) {
    super(
      datasource,
      datasource.manager.getRepository(ListingChannelModel).metadata.tableName,
    );
  }

  async update(channel: ListingChannel): Promise<void> {
    try {
      const model = this.aggregateRootToModel(channel);
      const variantIds = model.listingVariants.map((variant) => variant.id);

      await this.manager.transaction(async (transactionManager) => {
        await transactionManager.save(model);
        await transactionManager.getRepository(ListingVariantModel).update(
          {
            listingChannelId: model.id,
            id: Not(In(variantIds)),
          },
          {
            listingChannelId: null,
          },
        );
      });
    } catch (error) {
      throw new DatabaseOperationFailedError(
        'Update listing channel failed',
        error,
        `${SqlListingChannelRepository.name}.${this.update.name}`,
      );
    }
  }

  async findLmsCompany(companyId: string): Promise<LmsCompany | undefined> {
    try {
      const company = await this.manager
        .getRepository(LmsCompanyModel)
        .findOneBy({ id: companyId });

      return company
        ? this.companyMapper.fromModelToEntity(company)
        : undefined;
    } catch (error) {
      throw new DatabaseOperationFailedError(
        'Find LMS company failed',
        error,
        `${SqlListingChannelRepository.name}.${this.findLmsCompany.name}`,
      );
    }
  }

  override async findOne(id: string): Promise<ListingChannel | undefined> {
    try {
      const channel = await this.manager
        .getRepository(ListingChannelModel)
        .findOne({
          where: { id },
          relations: [
            'lmsCompany',
            'listingVariants',
            'listingVariants.listing',
            'listingVariants.listing.subCategory',
            'listingVariants.listing.subCategory.category',
            'listingVariants.batches',
            'listingVariants.batches.warehouse',
            'listingVariants.batches.warehouse.country',
          ],
        });

      return channel ? this.modelToAggregateRoot(channel) : undefined;
    } catch (error) {
      throw new DatabaseOperationFailedError(
        'Find listing channel failed',
        error,
        `${SqlListingChannelRepository.name}.${this.findOne.name}`,
      );
    }
  }

  async findListingVariantsByIds(
    listingVariantIds: string[],
  ): Promise<ListingVariant[]> {
    try {
      const variants = await this.manager
        .getRepository(ListingVariantModel)
        .find({
          where: { id: In(listingVariantIds) },
          relations: [
            'listing',
            'listing.subCategory',
            'listing.subCategory.category',
            'batches',
            'batches.warehouse',
            'batches.warehouse.country',
          ],
        });

      return variants.map((model) =>
        this.variantMapper.fromModelToEntity(model),
      );
    } catch (error) {
      throw new DatabaseOperationFailedError(
        'Find listing variants failed',
        error,
        `${SqlListingChannelRepository.name}.${this.findListingVariantsByIds.name}`,
      );
    }
  }

  async findListingVariantById(
    listingVariantId: string,
  ): Promise<ListingVariant | undefined> {
    try {
      const variant = await this.manager
        .getRepository(ListingVariantModel)
        .findOne({
          where: { id: listingVariantId },
          relations: [
            'listing',
            'listing.subCategory',
            'listing.subCategory.category',
            'batches',
            'batches.warehouse',
            'batches.warehouse.country',
          ],
        });

      return variant
        ? this.variantMapper.fromModelToEntity(variant)
        : undefined;
    } catch (error) {
      throw new DatabaseOperationFailedError(
        'Find listing variant failed',
        error,
        `${SqlListingChannelRepository.name}.${this.findListingVariantById.name}`,
      );
    }
  }

  async updateListingVariant(variant: ListingVariant): Promise<void> {
    try {
      const model = this.variantMapper.fromEntityToModel(variant);
      await this.manager.getRepository(ListingVariantModel).save(model);
    } catch (error) {
      throw new DatabaseOperationFailedError(
        'Update listing variant failed',
        error,
        `${SqlListingChannelRepository.name}.${this.updateListingVariant.name}`,
      );
    }
  }
}
