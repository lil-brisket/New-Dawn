import type { ContentDomain } from '@dawn/content-pipeline/domains';
import { migrateToV2 } from '@dawn/content-pipeline/migrations/v1-to-v2';
import type { ElementType } from '@dawn/types';
import {
  damageElementToSkillElement,
  skillElementToDamageElement,
} from '../components/fields/elementUtils';

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
    if (draft.targeting && typeof draft.targeting === 'object') {
      const t = draft.targeting as { type?: string };
      if (t.type === 'area') {
        draft.targeting = { type: 'single_enemy', range: (t as { range?: number }).range ?? 1 };
      }
    }
    if (!draft.targeting) draft.targeting = DEFAULT_SKILL_TARGETING;
    if (!draft.shapeType) draft.shapeType = 'aoe';
    if (!Array.isArray(draft.effects) || draft.effects.length === 0) {
      draft.effects = [DEFAULT_EFFECT];
    }

    const effects = draft.effects as Array<{ type?: string; element?: ElementType }>;
    const firstDamage = effects.find((e) => e.type === 'damage');
    if (!draft.element && firstDamage?.element) {
      draft.element = damageElementToSkillElement(firstDamage.element);
    }
    const damageElement = skillElementToDamageElement(draft.element as ElementType | undefined);
    draft.effects = effects.map((e) =>
      e.type === 'damage' ? { ...e, element: damageElement } : e,
    );

    if (draft.hpCost === undefined) draft.hpCost = 0;
    if (draft.spCost === undefined) draft.spCost = 0;
    if (draft.apCost === undefined) draft.apCost = 0;
    if (draft.cooldown === undefined) draft.cooldown = 0;
    delete draft.category;
    delete draft.tags;
    delete draft.inherits;
    delete draft.vfxId;
    delete draft.sfxId;
  }

  if (domain === 'statuses') {
    if (draft.duration === undefined) draft.duration = 1;
    if (draft.stackable === undefined) draft.stackable = false;
    if (draft.maxStacks === undefined) draft.maxStacks = 1;
    if (!Array.isArray(draft.behaviors)) draft.behaviors = [];
    delete draft.category;
    delete draft.tags;
    delete draft.inherits;
  }

  if (domain === 'enemies') {
    if (!Array.isArray(draft.skillIds)) draft.skillIds = [];
    if (!Array.isArray(draft.tags)) draft.tags = [];
  }

  return draft;
}
