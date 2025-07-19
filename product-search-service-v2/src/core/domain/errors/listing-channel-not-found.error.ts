import { DomainError } from 'src/shared/ddd';

export class ListingChannelNotFoundError extends DomainError {
  constructor(channelId: string) {
    super(`Channel ${channelId} not found`, { channelId });
  }
}
