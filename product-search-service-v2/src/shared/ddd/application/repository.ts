import { AggregateRoot, EntityProps } from '../domain';

export abstract class Repository<
  DomainAggregateRoot extends AggregateRoot<EntityProps>,
> {
  abstract findOne(id: string): Promise<DomainAggregateRoot | undefined>;

  abstract save(entity: DomainAggregateRoot): Promise<DomainAggregateRoot>;
}
