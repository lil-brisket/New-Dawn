import type { ContentDomain } from '@dawn/content-pipeline/domains';
import { migrateToV2 } from '@dawn/content-pipeline';

const DEFAULT_SKILL_TARGETING = { type: 'single_enemy' as const, range: 1 };
const DEFAULT_EFFECT = {
  type: 'damage' as const,
  element: 'physical' as const,
  value: { base: 0, terms: [{ source: 'stat' as const, key: 'attack', ratio: 1.0 }] },
};

export function upgradeDraft(
  domain: ContentDomain,
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const draft = migrateToV2({ ...raw });

  if (domain === 'skills') {
    if (draft.mpCost !== undefined && draft.spCost === undefined) {
      draft.spCost = draft.mpCost;
      delete draft.mpCost;
    }
    if (!draft.targeting) draft.targeting = DEFAULT_SKILL_TARGETING;
    if (!Array.isArray(draft.effects) || draft.effects.length === 0) {
      draft.effects = [DEFAULT_EFFECT];
    }
    if (draft.hpCost === undefined) draft.hpCost = 0;
    if (draft.spCost === undefined) draft.spCost = 0;
    if (draft.apCost === undefined) draft.apCost = 0;
    if (!Array.isArray(draft.tags)) draft.tags = [];
    if (draft.cooldown === undefined) draft.cooldown = 0;
  }

  if (domain === 'statuses') {
    if (draft.duration === undefined) draft.duration = 1;
    if (draft.stackable === undefined) draft.stackable = false;
    if (draft.maxStacks === undefined) draft.maxStacks = 1;
    if (!Array.isArray(draft.behaviors)) draft.behaviors = [];
    if (!Array.isArray(draft.tags)) draft.tags = [];
  }

  if (domain === 'enemies') {
    if (!Array.isArray(draft.skillIds)) draft.skillIds = [];
    if (!Array.isArray(draft.tags)) draft.tags = [];
  }

  return draft;
}
