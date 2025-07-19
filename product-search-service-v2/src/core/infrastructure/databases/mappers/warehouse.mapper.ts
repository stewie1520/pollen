import { Warehouse } from 'src/core/domain/entities/warehouses/warehouse';
import { WarehouseModel } from '../models';
import { CountryMapper } from './country.mapper';

export class WarehouseMapper {
  private readonly countryMapper: CountryMapper;

  constructor() {
    this.countryMapper = new CountryMapper();
  }

  fromEntityToModel = (entity: Warehouse): WarehouseModel => {
    return new WarehouseModel({
      id: entity.id,
      name: entity.name,
      country: this.countryMapper.fromEntityToModel(entity.country),
      countryId: entity.country.id,
    });
  };

  fromModelToEntity = (model: WarehouseModel): Warehouse => {
    return Warehouse.create({
      id: model.id,
      name: model.name,
      country: this.countryMapper.fromModelToEntity(model.country).getProps(),
    });
  };
}
