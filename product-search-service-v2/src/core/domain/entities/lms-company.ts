import { Entity, EntityProps } from 'src/shared/ddd';

export interface LmsCompanyProps extends EntityProps {
  name: string;
}

export class LmsCompany extends Entity<LmsCompanyProps> {
  private constructor(props: LmsCompanyProps) {
    super(props);
  }

  get name() {
    return this.props.name;
  }

  static create(props: LmsCompanyProps): LmsCompany {
    return new LmsCompany(props);
  }
}
