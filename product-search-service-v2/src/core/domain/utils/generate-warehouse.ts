import { Warehouse, WarehouseProps } from '../entities/warehouses/warehouse';
import { generateCountry } from './generate-country';

export const generateWarehouse = (
  partials: Partial<WarehouseProps> = {},
): Warehouse => {
  return Warehouse.create({
    ...partials,
    name: 'Singapore Warehouse',
    country: generateCountry(partials.country).getProps(),
  });
};
