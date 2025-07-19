import { ListingChannel } from 'src/core/domain/entities/listing-channel';
import { ListingChannelModel } from '../models';
import { ListingVariantMapper } from './listing-variant.mapper';
import { LmsCompanyMapper } from './lms-company.mapper';

export class ListingChannelMapper {
  private readonly lmsCompanyMapper: LmsCompanyMapper;
  private readonly listingVariantMapper: ListingVariantMapper;

  constructor() {
    this.lmsCompanyMapper = new LmsCompanyMapper();
    this.listingVariantMapper = new ListingVariantMapper();
  }

  fromEntityToModel = (entity: ListingChannel): ListingChannelModel => {
    return new ListingChannelModel({
      id: entity.id,
      name: entity.name,
      salesChannel: entity.salesChannel,
      lmsCompany: this.lmsCompanyMapper.fromEntityToModel(entity.lmsCompany),
      lmsCompanyId: entity.lmsCompany.id,
      listingVariants: entity.listingVariants.map((variant) =>
        this.listingVariantMapper.fromEntityToModel(variant),
      ),
      updatedBy: entity.updatedBy,
      createdBy: entity.createdBy,
    });
  };

  fromModelToEntity = (model: ListingChannelModel): ListingChannel => {
    return ListingChannel.create({
      id: model.id,
      name: model.name,
      salesChannel: model.salesChannel,
      lmsCompany: this.lmsCompanyMapper
        .fromModelToEntity(model.lmsCompany)
        .getProps(),
      listingVariants: model.listingVariants.map((variant) =>
        this.listingVariantMapper.fromModelToEntity(variant).getProps(),
      ),
      updatedBy: model.updatedBy,
      createdBy: model.createdBy,
    });
  };
}
