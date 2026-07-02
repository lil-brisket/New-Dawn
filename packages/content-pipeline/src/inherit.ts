import type { RawEnemy, RawSkill, RawTag } from './schemas';
import {
  defaultEnemyFields,
  defaultSkillFields,
  defaultTagFields,
  mergeEnemyRaw,
  mergeSkillRaw,
  mergeTagRaw,
} from './defaults';

export interface PipelineError {
  file: string;
  id?: string;
  message: string;
  severity: 'error' | 'warning';
}

type Inheritable = { id: string; inherits?: string };

function resolveChain<T extends Inheritable>(
  id: string,
  items: Map<string, T>,
  merge: (base: T, child: T) => T,
  fileMap: Map<string, string>,
): { merged: T; errors: PipelineError[] } {
  const errors: PipelineError[] = [];
  const visited = new Set<string>();
  const chain: string[] = [];

  function walk(currentId: string): T | undefined {
    if (visited.has(currentId)) {
      errors.push({
        file: fileMap.get(currentId) ?? currentId,
        id: currentId,
        message: `Inheritance cycle detected: ${[...chain, currentId].join(' → ')}`,
        severity: 'error',
      });
      return undefined;
    }
    visited.add(currentId);
    chain.push(currentId);

    const item = items.get(currentId);
    if (!item) {
      errors.push({
        file: fileMap.get(currentId) ?? currentId,
        id: currentId,
        message: `Unknown inherits target: ${currentId}`,
        severity: 'error',
      });
      return undefined;
    }

    if (!item.inherits) {
      chain.pop();
      return item;
    }

    const parent = walk(item.inherits);
    chain.pop();
    if (!parent) return undefined;
    return merge(parent, item);
  }

  const merged = walk(id);
  return { merged: merged!, errors };
}

export function resolveSkillInheritance(
  items: Map<string, RawSkill>,
  fileMap: Map<string, string>,
): { resolved: Map<string, RawSkill>; errors: PipelineError[] } {
  const resolved = new Map<string, RawSkill>();
  const errors: PipelineError[] = [];

  for (const id of items.keys()) {
    const result = resolveChain(id, items, mergeSkillRaw, fileMap);
    errors.push(...result.errors);
    if (result.merged) {
      resolved.set(id, result.merged);
    }
  }

  return { resolved, errors };
}

export function resolveTagInheritance(
  items: Map<string, RawTag>,
  fileMap: Map<string, string>,
): { resolved: Map<string, RawTag>; errors: PipelineError[] } {
  const resolved = new Map<string, RawTag>();
  const errors: PipelineError[] = [];

  for (const id of items.keys()) {
    const result = resolveChain(id, items, mergeTagRaw, fileMap);
    errors.push(...result.errors);
    if (result.merged) {
      resolved.set(id, result.merged);
    }
  }

  return { resolved, errors };
}

/** @deprecated Use resolveTagInheritance */
export const resolveStatusInheritance = resolveTagInheritance;

export function resolveEnemyInheritance(
  items: Map<string, RawEnemy>,
  fileMap: Map<string, string>,
): { resolved: Map<string, RawEnemy>; errors: PipelineError[] } {
  const resolved = new Map<string, RawEnemy>();
  const errors: PipelineError[] = [];

  for (const id of items.keys()) {
    const result = resolveChain(id, items, mergeEnemyRaw, fileMap);
    errors.push(...result.errors);
    if (result.merged) {
      resolved.set(id, result.merged);
    }
  }

  return { resolved, errors };
}

export function rawToDefaultSkill(id: string, name: string): RawSkill {
  const defaults = defaultSkillFields(id);
  return {
    id,
    name,
    description: defaults.description,
    hpCost: defaults.hpCost,
    spCost: defaults.spCost,
    apCost: defaults.apCost,
    cooldown: defaults.cooldown,
    effects: defaults.effects as RawSkill['effects'],
    targeting: defaults.targeting,
    shapeType: defaults.shapeType,
    iconId: defaults.iconId,
    vfxId: defaults.vfxId,
    sfxId: defaults.sfxId,
    category: defaults.category,
    labels: defaults.labels,
  };
}

export function rawToDefaultTag(id: string, name: string): RawTag {
  const defaults = defaultTagFields(id);
  return {
    id,
    name,
    description: defaults.description,
    duration: defaults.duration,
    stackable: defaults.stackable,
    maxStacks: defaults.maxStacks,
    iconId: defaults.iconId,
    behaviors: defaults.behaviors as RawTag['behaviors'],
    labels: defaults.labels,
  };
}

/** @deprecated Use rawToDefaultTag */
export const rawToDefaultStatus = rawToDefaultTag;

export function rawToDefaultEnemy(id: string, name: string): RawEnemy {
  const defaults = defaultEnemyFields(id);
  return {
    id,
    name,
    description: defaults.description,
    portraitId: defaults.portraitId,
    spriteId: defaults.spriteId,
    baseStats: defaults.baseStats,
    skillIds: defaults.skillIds,
    aiProfileId: defaults.aiProfileId,
    lootTableId: defaults.lootTableId,
    element: defaults.element,
    labels: defaults.labels,
  };
}
