import { Entity, EntityProps } from 'src/shared/ddd';

export interface CountryProps extends EntityProps {
  name: string;
}

export class Country extends Entity<CountryProps> {
  private constructor(props: CountryProps) {
    super(props);
  }

  get name() {
    return this.props.name;
  }

  static create(props: CountryProps) {
    return new Country(props);
  }
}
