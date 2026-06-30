import type { EnemyDefinition, SkillDefinition, StatusDefinition } from '@dawn/types';
import type { RawEnemy, RawSkill, RawStatus } from './schemas';

function skillSlug(id: string): string {
  return id.replace(/^skill_/, '');
}

function statusSlug(id: string): string {
  return id.replace(/^status_/, '');
}

function enemySlug(id: string): string {
  return id.replace(/^enemy_/, '');
}

export function defaultSkillFields(id: string): Omit<SkillDefinition, 'id' | 'name'> {
  const slug = skillSlug(id);
  return {
    description: '',
    hpCost: 0,
    spCost: 0,
    apCost: 0,
    cooldown: 0,
    effects: [{ type: 'damage', element: 'physical', multiplier: 1.0 }],
    targeting: { type: 'single_enemy', range: 1 },
    iconId: `icon_${slug}`,
    vfxId: `vfx_${slug}`,
    sfxId: `sfx_${slug}`,
    animationKey: `anim_${slug}`,
    soundKey: `sfx_${slug}`,
    category: 'physical',
    tags: [],
  };
}

export function defaultStatusFields(id: string): Omit<StatusDefinition, 'id' | 'name'> {
  const slug = statusSlug(id);
  return {
    description: '',
    duration: 1,
    stackable: false,
    maxStacks: 1,
    iconId: `icon_${slug}`,
    behaviors: [],
    tags: [],
  };
}

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
      critRate: 0.05,
      critDamage: 1.2,
    },
    skillIds: [],
    aiProfileId: 'ai_aggressive',
    lootTableId: `loot_${slug}`,
    element: 'earth',
    tags: [],
  };
}

export function inferCategoryFromPath(filePath: string): string | undefined {
  const parts = filePath.replace(/\\/g, '/').split('/');
  const domainIndex = parts.findIndex((p) => ['skills', 'statuses', 'enemies'].includes(p));
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

export function mergeStatusRaw(base: RawStatus, override: RawStatus): RawStatus {
  const { inherits: _b, id: _bid, name: _bname, ...b } = base;
  const { inherits: _o, id, name, ...rest } = override;
  return { id, name, ...b, ...rest };
}

export function mergeEnemyRaw(base: RawEnemy, override: RawEnemy): RawEnemy {
  const { inherits: _b, id: _bid, name: _bname, ...b } = base;
  const { inherits: _o, id, name, ...rest } = override;
  const merged: RawEnemy = { id, name, ...b, ...rest };
  if (b.baseStats && rest.baseStats) {
    merged.baseStats = { ...b.baseStats, ...rest.baseStats };
  }
  return merged;
}
