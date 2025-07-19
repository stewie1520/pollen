import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { TestModule } from '../../../../shared/test';
import { CoreModule } from '../../../core.module';
import { SaleChannelEnum } from '../../../domain/enums';
import { LmsCompanyNotFoundError } from '../../../domain/errors';
import {
  generateCategory,
  generateListing,
  generateListingVariant,
  generateLmsCompany,
  generateSubCategory,
} from '../../../domain/utils';
import {
  CategoryMapper,
  ListingMapper,
  ListingVariantMapper,
  LmsCompanyMapper,
  SubCategoryMapper,
} from '../../../infrastructure/databases/mappers';
import { ListingChannelRepository } from '../../repositories/listing-channel.repository';
import { SearchService } from '../../services/search.service';
import { StubSearchService } from '../../services/stub-search.service';
import {
  CreateListingChannelCommand,
  CreateListingChannelCommandHandler,
} from './create-listing-channel.command';

describe(CreateListingChannelCommand, () => {
  let commandHandler: CreateListingChannelCommandHandler;
  let app: INestApplication;
  let dataSource: DataSource;
  let listingChannelRepository: ListingChannelRepository;

  const companyMapper = new LmsCompanyMapper();
  const categoryMapper = new CategoryMapper();
  const subCategoryMapper = new SubCategoryMapper();
  const listingMapper = new ListingMapper();
  const listingVariantMapper = new ListingVariantMapper();

  beforeAll(async () => {
    const testingModuleBuilder = Test.createTestingModule({
      imports: [TestModule, CoreModule],
    });

    testingModuleBuilder
      .overrideProvider(SearchService)
      .useClass(StubSearchService);

    const testingModule = await testingModuleBuilder.compile();

    app = testingModule.createNestApplication();

    await app.init();

    dataSource = app.get(DataSource);
    commandHandler = app.get(CreateListingChannelCommandHandler);
    listingChannelRepository = app.get(ListingChannelRepository);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('given valid variant IDs and company', () => {
    it('should create a listing channel', async () => {
      const company = generateLmsCompany();
      const category = generateCategory();
      const subCategory = generateSubCategory({
        category: category.getProps(),
      });
      const listing = generateListing({
        subCategory: subCategory.getProps(),
      });
      const listingVariant = generateListingVariant({
        listing: listing.getProps(),
      });

      await dataSource.transaction(async (manager) => {
        await manager.save(companyMapper.fromEntityToModel(company));
        await manager.save(categoryMapper.fromEntityToModel(category));
        await manager.save(subCategoryMapper.fromEntityToModel(subCategory));
        await manager.save(listingMapper.fromEntityToModel(listing));
        await manager.save(
          listingVariantMapper.fromEntityToModel(listingVariant),
        );
      });

      const command = new CreateListingChannelCommand(
        'Default Listing Channel',
        SaleChannelEnum.MARKETPLACE,
        company.id,
        [listingVariant.id],
      );

      const listingChannelId = await commandHandler.execute(command);

      const listingChannel =
        await listingChannelRepository.findOne(listingChannelId);

      expect(listingChannel).toBeDefined();
      expect(listingChannel?.name).toBe(command.name);
      expect(listingChannel?.salesChannel).toBe(command.salesChannel);
      expect(listingChannel?.lmsCompany.id).toBe(command.lmsCompanyId);
      expect(listingChannel?.listingVariants).toHaveLength(
        command.listingVariantIds.length,
      );
    });

    it('should throw an error if the company is not found', async () => {
      const command = new CreateListingChannelCommand(
        'Default Listing Channel',
        SaleChannelEnum.MARKETPLACE,
        randomUUID(),
        [randomUUID()],
      );

      await expect(commandHandler.execute(command)).rejects.toThrow(
        LmsCompanyNotFoundError,
      );
    });
  });
});
