import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateListingVariantNameInDto } from './dto';
import { UpdateListingVariantNameCommand } from '../../../application/commands/update-listing-variant-name/update-listing-variant-name';

@Controller('listing-variants')
export class ListingVariantController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('/:listingVariantId/name')
  async updateListingVariantName(
    @Param('listingVariantId') listingVariantId: string,
    @Body() body: UpdateListingVariantNameInDto,
  ) {
    await this.commandBus.execute(
      new UpdateListingVariantNameCommand(listingVariantId, body.name),
    );
  }
}
