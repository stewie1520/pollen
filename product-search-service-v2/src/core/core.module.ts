import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';

import { CreateListingChannelCommandHandler } from './application/commands/create-listing-channel/create-listing-channel.command';
import { DeleteListingVariantFromChannelCommandHandler } from './application/commands/delete-listing-variant-from-channel/delete-listing-variant-from-channel.command';
import { TransformAndIndexListingChannelCommandHandler } from './application/commands/transform-and-index-listing-channel/transform-and-index-listing-channel.command';
import { TransformAndIndexListingChannelSaga } from './application/commands/transform-and-index-listing-channel/transform-and-index-listing-channel.saga';
import { UpdateListingVariantNameCommandHandler } from './application/commands/update-listing-variant-name/update-listing-variant-name';
import { SearchListingChannelQueryHandler } from './application/queries/search-listing-channel/search-listing-channel.query';
import { ListingChannelRepository } from './application/repositories/listing-channel.repository';
import { SearchService } from './application/services/search.service';
import { ListingChannelController } from './infrastructure/controllers/listing-channel/listing-channel.controller';
import { ListingVariantController } from './infrastructure/controllers/listing-variant/listing-variant.controller';
import * as models from './infrastructure/databases/models';
import { AllExceptionFilter } from './infrastructure/filters/all-exception.filter';
import { SqlListingChannelRepository } from './infrastructure/repositories/sql-listing-channel.repository';
import { ElasticSearchService } from './infrastructure/services/es-search.service';

const commandHandlers = [
  CreateListingChannelCommandHandler,
  UpdateListingVariantNameCommandHandler,
  DeleteListingVariantFromChannelCommandHandler,
  TransformAndIndexListingChannelCommandHandler,
];

const sagas = [TransformAndIndexListingChannelSaga];

const queryHandlers = [SearchListingChannelQueryHandler];

const repositories = [
  {
    provide: ListingChannelRepository,
    useClass: SqlListingChannelRepository,
  },
];

const services = [
  {
    provide: SearchService,
    useClass: ElasticSearchService,
  },
];

const controllers = [ListingVariantController, ListingChannelController];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature(Object.values(models)),
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          node: configService.get<string>('ELASTICSEARCH_URL'),
        };
      },
    }),
  ],
  providers: [
    ...commandHandlers,
    ...sagas,
    ...queryHandlers,
    ...repositories,
    ...services,
    Logger,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
  controllers,
  exports: [],
})
export class CoreModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) {}

  async onModuleInit() {
    await this.searchService.initIndices();
  }
}
