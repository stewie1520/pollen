import { Entity, EntityProps } from 'src/shared/ddd';

import { Country, CountryProps } from './country';

export interface WarehouseProps extends EntityProps {
  name: string;
  country: CountryProps;
}

export class Warehouse extends Entity<WarehouseProps> {
  private countryEntity: Country;

  private constructor(props: WarehouseProps) {
    super(props);

    this.countryEntity = Country.create(props.country);
  }

  get name() {
    return this.props.name;
  }

  get country() {
    return this.countryEntity;
  }

  static create(props: WarehouseProps) {
    return new Warehouse(props);
  }
}
