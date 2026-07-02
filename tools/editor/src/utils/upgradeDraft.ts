import type { ContentDomain } from '@dawn/content-pipeline/domains';
import { migrateContent } from '@dawn/content-pipeline/migrations/applyMigrations';
import type { ElementType } from '@dawn/types';
import {
  damageElementToSkillElement,
  skillElementToDamageElement,
} from '../components/fields/elementUtils';

const DEFAULT_SKILL_TARGETING = { type: 'single_enemy' as const, range: 1 };
const DEFAULT_EFFECT = {
  type: 'apply_tag' as const,
  tagId: 'tag_damage',
  chance: 1,
  overrides: {
    instant_damage: {
      element: 'physical' as const,
      value: { base: 0, terms: [{ source: 'stat' as const, key: 'attack', ratio: 1.0 }] },
    },
  },
};

export function upgradeDraft(
  domain: ContentDomain,
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const draft = migrateContent({ ...raw });

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

    const effects = draft.effects as Array<{
      type?: string;
      overrides?: { instant_damage?: { element?: ElementType } };
    }>;
    const firstDamage = effects.find((e) => e.type === 'apply_tag' && e.overrides?.instant_damage);
    if (!draft.element && firstDamage?.overrides?.instant_damage?.element) {
      draft.element = damageElementToSkillElement(firstDamage.overrides.instant_damage.element);
    }
    const damageElement = skillElementToDamageElement(draft.element as ElementType | undefined);
    draft.effects = effects.map((e) =>
      e.type === 'apply_tag' && e.overrides?.instant_damage
        ? {
            ...e,
            overrides: {
              ...e.overrides,
              instant_damage: { ...e.overrides.instant_damage, element: damageElement },
            },
          }
        : e,
    );

    if (draft.hpCost === undefined) draft.hpCost = 0;
    if (draft.spCost === undefined) draft.spCost = 0;
    if (draft.apCost === undefined) draft.apCost = 0;
    if (draft.cooldown === undefined) draft.cooldown = 0;
    delete draft.category;
    delete draft.labels;
    delete draft.inherits;
    delete draft.vfxId;
    delete draft.sfxId;
  }

  if (domain === 'tags') {
    if (draft.duration === undefined) draft.duration = 1;
    if (draft.stackable === undefined) draft.stackable = false;
    if (draft.maxStacks === undefined) draft.maxStacks = 1;
    if (!Array.isArray(draft.behaviors)) draft.behaviors = [];
    delete draft.category;
    delete draft.labels;
    delete draft.inherits;
  }

  if (domain === 'enemies') {
    if (!Array.isArray(draft.skillIds)) draft.skillIds = [];
    if (!Array.isArray(draft.labels)) draft.labels = [];
  }

  return draft;
}
