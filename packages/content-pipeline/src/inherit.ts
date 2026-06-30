import type { RawEnemy, RawSkill, RawStatus } from './schemas';
import {
  defaultEnemyFields,
  defaultSkillFields,
  defaultStatusFields,
  mergeEnemyRaw,
  mergeSkillRaw,
  mergeStatusRaw,
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

export function resolveStatusInheritance(
  items: Map<string, RawStatus>,
  fileMap: Map<string, string>,
): { resolved: Map<string, RawStatus>; errors: PipelineError[] } {
  const resolved = new Map<string, RawStatus>();
  const errors: PipelineError[] = [];

  for (const id of items.keys()) {
    const result = resolveChain(id, items, mergeStatusRaw, fileMap);
    errors.push(...result.errors);
    if (result.merged) {
      resolved.set(id, result.merged);
    }
  }

  return { resolved, errors };
}

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
    mpCost: defaults.mpCost,
    cooldown: defaults.cooldown,
    effects: defaults.effects as RawSkill['effects'],
    targeting: defaults.targeting,
    iconId: defaults.iconId,
    vfxId: defaults.vfxId,
    sfxId: defaults.sfxId,
    category: defaults.category,
    tags: defaults.tags,
  };
}

export function rawToDefaultStatus(id: string, name: string): RawStatus {
  const defaults = defaultStatusFields(id);
  return {
    id,
    name,
    description: defaults.description,
    duration: defaults.duration,
    stackable: defaults.stackable,
    maxStacks: defaults.maxStacks,
    iconId: defaults.iconId,
    behaviors: defaults.behaviors as RawStatus['behaviors'],
    tags: defaults.tags,
  };
}

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
    tags: defaults.tags,
  };
}
