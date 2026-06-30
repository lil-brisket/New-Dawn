import type { ResourceType } from './constants';

export type ResourceCost = { resource: ResourceType; amount: number };

export type FlatCosts = {
  hpCost?: number;
  spCost?: number;
  apCost?: number;
  /** @deprecated legacy field — migrated to spCost on load */
  mpCost?: number;
};

export function flatCostsToResourceList(costs: FlatCosts): ResourceCost[] {
  const legacySp = costs.mpCost;
  const entries: ResourceCost[] = [];
  if ((costs.hpCost ?? 0) > 0) entries.push({ resource: 'hp', amount: costs.hpCost! });
  const sp = costs.spCost ?? legacySp ?? 0;
  if (sp > 0) entries.push({ resource: 'sp', amount: sp });
  if ((costs.apCost ?? 0) > 0) entries.push({ resource: 'ap', amount: costs.apCost! });
  return entries;
}

export function resourceListToFlatCosts(costs: ResourceCost[]): FlatCosts {
  const result: FlatCosts = {};
  for (const { resource, amount } of costs) {
    if (amount <= 0) continue;
    if (resource === 'hp') result.hpCost = amount;
    if (resource === 'sp') result.spCost = amount;
    if (resource === 'ap') result.apCost = amount;
  }
  return result;
}
