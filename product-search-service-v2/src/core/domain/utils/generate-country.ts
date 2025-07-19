import { Country, CountryProps } from '../entities/warehouses/country';

export const generateCountry = (
  partials: Partial<CountryProps> = {},
): Country => {
  return Country.create({
    ...partials,
    name: partials.name || 'Singapore',
  });
};
