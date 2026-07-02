import type { TagBehavior, TagBehaviorOverrides, TagDefinition } from '@dawn/types';

export function mergeTagBehaviors(
  definition: TagDefinition,
  overrides?: TagBehaviorOverrides,
): TagBehavior[] {
  if (!overrides) return [...definition.behaviors];

  return definition.behaviors.map((behavior) => {
    const key = behavior.type as keyof TagBehaviorOverrides;
    const override = overrides[key];
    if (!override) return behavior;
    return { ...behavior, ...override } as TagBehavior;
  });
}

const INSTANT_BEHAVIOR_TYPES = new Set([
  'instant_damage',
  'instant_heal',
  'shield_grant',
  'move',
  'teleport',
  'summon',
  'clear',
  'cleanse',
]);

export function isInstantOnlyTag(behaviors: readonly TagBehavior[]): boolean {
  return behaviors.length > 0 && behaviors.every((b) => INSTANT_BEHAVIOR_TYPES.has(b.type));
}

export function shouldPersistTag(duration: number, behaviors: readonly TagBehavior[]): boolean {
  if (duration <= 0 && isInstantOnlyTag(behaviors)) return false;
  return duration > 0 || behaviors.some((b) => !INSTANT_BEHAVIOR_TYPES.has(b.type));
}
