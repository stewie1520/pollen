import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateListingChannelCommand } from 'src/core/application/commands/create-listing-channel/create-listing-channel.command';

import { DeleteListingVariantFromChannelCommand } from '../../../application/commands/delete-listing-variant-from-channel/delete-listing-variant-from-channel.command';
import {
  ListingChannelQueryResult,
  SearchListingChannelQuery,
} from '../../../application/queries/search-listing-channel/search-listing-channel.query';
import { CreateListingChannelInDto, SearchListingChannelInDto } from './dto';

@Controller('listing-channels')
export class ListingChannelController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/')
  async createListingChannel(@Body() body: CreateListingChannelInDto) {
    await this.commandBus.execute(
      new CreateListingChannelCommand(
        body.name,
        body.salesChannel,
        body.lmsCompanyId,
        body.listingVariantIds,
      ),
    );
  }

  @Delete('/:channelId/listing-variants/:listingVariantId')
  async deleteListingVariantFromChannel(
    @Param('channelId') channelId: string,
    @Param('listingVariantId') listingVariantId: string,
  ) {
    await this.commandBus.execute(
      new DeleteListingVariantFromChannelCommand(channelId, listingVariantId),
    );
  }

  @Get('/search')
  async searchListingChannels(@Query() query: SearchListingChannelInDto) {
    const result = await this.queryBus.execute<
      SearchListingChannelQuery,
      ListingChannelQueryResult
    >(new SearchListingChannelQuery(query.q, query.page, query.limit));

    return {
      total: result.total,
      data: result.data,
    };
  }
}
