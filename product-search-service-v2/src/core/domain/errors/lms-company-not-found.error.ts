import { DomainError } from 'src/shared/ddd';

export class LmsCompanyNotFoundError extends DomainError {
  constructor(companyId: string) {
    super(`Company with ID ${companyId} not found`, { companyId });
  }
}
