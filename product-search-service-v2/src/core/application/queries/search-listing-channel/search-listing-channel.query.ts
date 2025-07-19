import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  IndexListingChannelDocument,
  SearchService,
} from '../../services/search.service';

export class SearchListingChannelQuery implements IQuery {
  constructor(
    public readonly query: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

@QueryHandler(SearchListingChannelQuery)
export class SearchListingChannelQueryHandler
  implements IQueryHandler<SearchListingChannelQuery, ListingChannelQueryResult>
{
  constructor(private readonly searchService: SearchService) {}

  async execute({
    query,
    page,
    limit,
  }: SearchListingChannelQuery): Promise<ListingChannelQueryResult> {
    const result = await this.searchService.searchListingChannel(
      query,
      page,
      limit,
    );

    return {
      total: result.total,
      data: result.data,
    };
  }
}

export type ListingChannelQueryResult = {
  total: number;
  data: IndexListingChannelDocument[];
};
