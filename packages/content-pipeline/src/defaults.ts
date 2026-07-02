import type { EnemyDefinition, SkillDefinition, TagDefinition } from '@dawn/types';
import type { RawEnemy, RawSkill, RawTag } from './schemas';

function skillSlug(id: string): string {
  return id.replace(/^skill_/, '');
}

function tagSlug(id: string): string {
  return id.replace(/^tag_/, '');
}

function enemySlug(id: string): string {
  return id.replace(/^enemy_/, '');
}

const defaultDamageFormula = {
  base: 0,
  terms: [{ source: 'stat' as const, key: 'attack', ratio: 1.0 }],
};

export function defaultSkillFields(id: string): Omit<SkillDefinition, 'id' | 'name'> {
  const slug = skillSlug(id);
  return {
    description: '',
    hpCost: 0,
    spCost: 0,
    apCost: 0,
    cooldown: 0,
    effects: [
      {
        type: 'apply_tag',
        tagId: 'tag_damage',
        chance: 1,
        overrides: {
          instant_damage: { element: 'physical', value: defaultDamageFormula },
        },
      },
    ],
    targeting: { type: 'single_enemy', range: 1 },
    shapeType: 'aoe',
    iconId: `icon_${slug}`,
    vfxId: `vfx_${slug}`,
    sfxId: `sfx_${slug}`,
    animationKey: `anim_${slug}`,
    soundKey: `sfx_${slug}`,
    category: 'physical',
    labels: [],
    schemaVersion: 3,
  };
}

export function defaultTagFields(id: string): Omit<TagDefinition, 'id' | 'name'> {
  const slug = tagSlug(id);
  return {
    description: '',
    duration: 1,
    stackable: false,
    maxStacks: 1,
    iconId: `icon_${slug}`,
    behaviors: [],
    labels: [],
    schemaVersion: 3,
  };
}

/** @deprecated Use defaultTagFields */
export const defaultStatusFields = defaultTagFields;

export function defaultEnemyFields(id: string): Omit<EnemyDefinition, 'id' | 'name'> {
  const slug = enemySlug(id);
  return {
    description: '',
    portraitId: `portrait_${slug}`,
    spriteId: `sprite_${slug}`,
    baseStats: {
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      attack: 20,
      defense: 10,
      speed: 50,
      willpower: 10,
      resistance: 10,
    },
    skillIds: [],
    aiProfileId: 'ai_aggressive',
    lootTableId: `loot_${slug}`,
    element: 'earth',
    labels: [],
    schemaVersion: 3,
  };
}

export function inferCategoryFromPath(filePath: string): string | undefined {
  const parts = filePath.replace(/\\/g, '/').split('/');
  const domainIndex = parts.findIndex((p) => ['skills', 'tags', 'statuses', 'enemies'].includes(p));
  if (domainIndex >= 0 && parts[domainIndex + 1] && !parts[domainIndex + 1]!.endsWith('.json')) {
    return parts[domainIndex + 1];
  }
  return undefined;
}

export function mergeSkillRaw(base: RawSkill, override: RawSkill): RawSkill {
  const { inherits: _b, id: _bid, name: _bname, ...b } = base;
  const { inherits: _o, id, name, ...rest } = override;
  return { id, name, ...b, ...rest };
}

export function mergeTagRaw(base: RawTag, override: RawTag): RawTag {
  const { inherits: _b, id: _bid, name: _bname, ...b } = base;
  const { inherits: _o, id, name, ...rest } = override;
  return { id, name, ...b, ...rest };
}

/** @deprecated Use mergeTagRaw */
export const mergeStatusRaw = mergeTagRaw;

export function mergeEnemyRaw(base: RawEnemy, override: RawEnemy): RawEnemy {
  const { inherits: _b, id: _bid, name: _bname, ...b } = base;
  const { inherits: _o, id, name, ...rest } = override;
  const merged: RawEnemy = { id, name, ...b, ...rest };
  if (b.baseStats && rest.baseStats) {
    merged.baseStats = { ...b.baseStats, ...rest.baseStats };
  }
  return merged;
}
