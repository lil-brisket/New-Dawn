import type {
  EnemyDefinition,
  SkillDefinition,
  SkillEffect,
  StatusBehavior,
  StatusDefinition,
} from '@dawn/types';
import type { RawEnemy, RawSkill, RawStatus } from './schemas';
import {
  defaultEnemyFields,
  defaultSkillFields,
  defaultStatusFields,
  inferCategoryFromPath,
} from './defaults';

function vfxToAnim(vfxId: string): string {
  return vfxId.startsWith('vfx_') ? `anim_${vfxId.slice(4)}` : vfxId;
}

export function normalizeSkill(raw: RawSkill, filePath?: string): SkillDefinition {
  const defaults = defaultSkillFields(raw.id);
  const vfxId = raw.vfxId ?? defaults.vfxId;
  const sfxId = raw.sfxId ?? defaults.sfxId;

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? defaults.description,
    hpCost: raw.hpCost ?? defaults.hpCost,
    spCost: raw.spCost ?? raw.mpCost ?? defaults.spCost,
    apCost: raw.apCost ?? defaults.apCost,
    cooldown: raw.cooldown ?? defaults.cooldown,
    effects: (raw.effects ?? defaults.effects) as SkillEffect[],
    targeting: raw.targeting ?? defaults.targeting,
    shapeType: raw.shapeType ?? defaults.shapeType,
    iconId: raw.iconId ?? defaults.iconId,
    vfxId,
    sfxId,
    animationKey: vfxToAnim(vfxId),
    soundKey: sfxId,
    category: raw.category ?? inferCategoryFromPath(filePath ?? '') ?? defaults.category,
    element: raw.element,
    weaponType: raw.weaponType,
    job: raw.job,
    rarity: raw.rarity,
    tags: raw.tags ?? defaults.tags ?? [],
    unlockLevel: raw.unlockLevel,
    schemaVersion: raw.schemaVersion ?? 2,
  };
}

export function normalizeStatus(raw: RawStatus, filePath?: string): StatusDefinition {
  const defaults = defaultStatusFields(raw.id);

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? defaults.description,
    duration: raw.duration ?? defaults.duration,
    stackable: raw.stackable ?? defaults.stackable,
    maxStacks: raw.maxStacks ?? defaults.maxStacks,
    iconId: raw.iconId ?? defaults.iconId,
    behaviors: (raw.behaviors ?? defaults.behaviors) as StatusBehavior[],
    applicationFormula: raw.applicationFormula,
    durationFormula: raw.durationFormula,
    category: raw.category ?? inferCategoryFromPath(filePath ?? ''),
    element: raw.element,
    weaponType: raw.weaponType,
    job: raw.job,
    rarity: raw.rarity,
    tags: raw.tags ?? defaults.tags ?? [],
    unlockLevel: raw.unlockLevel,
    schemaVersion: raw.schemaVersion ?? 2,
  };
}

export function normalizeEnemy(raw: RawEnemy, filePath?: string): EnemyDefinition {
  const defaults = defaultEnemyFields(raw.id);
  const baseStats = { ...defaults.baseStats, ...raw.baseStats };

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? defaults.description,
    portraitId: raw.portraitId ?? defaults.portraitId,
    spriteId: raw.spriteId ?? defaults.spriteId,
    baseStats,
    skillIds: raw.skillIds ?? defaults.skillIds,
    aiProfileId: raw.aiProfileId ?? defaults.aiProfileId,
    lootTableId: raw.lootTableId ?? defaults.lootTableId,
    element: raw.element ?? defaults.element,
    category: raw.category ?? inferCategoryFromPath(filePath ?? ''),
    weaponType: raw.weaponType,
    job: raw.job,
    rarity: raw.rarity,
    tags: raw.tags ?? defaults.tags ?? [],
    unlockLevel: raw.unlockLevel,
    schemaVersion: raw.schemaVersion ?? 2,
  };
}
