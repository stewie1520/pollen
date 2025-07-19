import { LmsCompany, LmsCompanyProps } from '../entities/lms-company';

export const generateLmsCompany = (
  partials: Partial<LmsCompanyProps> = {},
): LmsCompany => {
  return LmsCompany.create({
    name: 'Pollen Company',
    ...partials,
  });
};
