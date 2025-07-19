import { Country } from 'src/core/domain/entities/warehouses/country';
import { CountryModel } from '../models';

export class CountryMapper {
  fromEntityToModel = (entity: Country): CountryModel => {
    return new CountryModel({
      id: entity.id,
      name: entity.name,
    });
  };

  fromModelToEntity = (model: CountryModel): Country => {
    return Country.create({
      id: model.id,
      name: model.name,
    });
  };
}
