import { LmsCompany } from 'src/core/domain/entities/lms-company';
import { LmsCompanyModel } from '../models';

export class LmsCompanyMapper {
  fromEntityToModel = (entity: LmsCompany): LmsCompanyModel => {
    return new LmsCompanyModel({
      id: entity.id,
      name: entity.name,
    });
  };

  fromModelToEntity = (model: LmsCompanyModel): LmsCompany => {
    return LmsCompany.create({
      id: model.id,
      name: model.name,
    });
  };
}
