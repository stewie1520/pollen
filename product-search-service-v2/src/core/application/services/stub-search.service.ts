/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { IndexListingChannelDocument, SearchService } from './search.service';

export class StubSearchService implements SearchService {
  async initIndices(): Promise<void> {
    // no ops
  }

  async indexListingChannel(
    _input: IndexListingChannelDocument,
  ): Promise<void> {
    // no ops
  }

  async deleteListingChannel(_listingChannelId: string): Promise<void> {
    // no ops
  }

  async searchListingChannel(
    _query: string,
    _page: number,
    _limit: number,
  ): Promise<{ total: number; data: IndexListingChannelDocument[] }> {
    // no ops
    return {
      total: 0,
      data: [],
    };
  }
}
