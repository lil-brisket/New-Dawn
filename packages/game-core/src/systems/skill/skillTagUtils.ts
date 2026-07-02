import type { DefinitionRegistry } from '@dawn/game-data';
import type { ApplyTagEffect, SkillDefinition, TagBehavior } from '@dawn/types';

function movementRange(
  behavior: Extract<TagBehavior, { type: 'move' | 'teleport' }>,
  override?: Partial<{ range: number; teleport?: boolean }>,
): { range: number; teleport: boolean } {
  if (behavior.type === 'teleport') {
    return { range: override?.range ?? behavior.range, teleport: true };
  }
  return {
    range: override?.range ?? behavior.range,
    teleport: override?.teleport ?? behavior.teleport === true,
  };
}

function findMovementFromTag(
  effect: ApplyTagEffect,
  registry: DefinitionRegistry,
): { range: number; teleport: boolean } | undefined {
  const tag = registry.getTag(effect.tagId);
  if (!tag) return undefined;

  for (const behavior of tag.behaviors) {
    if (behavior.type === 'teleport') {
      const override = effect.overrides?.teleport;
      return movementRange(behavior, override);
    }
    if (behavior.type === 'move') {
      const override = effect.overrides?.move;
      const resolved = movementRange(behavior, override);
      return resolved;
    }
  }
  return undefined;
}

export function skillHasTeleport(skill: SkillDefinition, registry: DefinitionRegistry): boolean {
  return skill.effects.some((effect) => {
    if (effect.type !== 'apply_tag') return false;
    const movement = findMovementFromTag(effect, registry);
    return movement?.teleport === true;
  });
}

export function skillHasMove(skill: SkillDefinition, registry: DefinitionRegistry): boolean {
  return skill.effects.some((effect) => {
    if (effect.type !== 'apply_tag') return false;
    const movement = findMovementFromTag(effect, registry);
    return movement !== undefined && movement.teleport !== true;
  });
}

export function getSkillMovementRange(
  skill: SkillDefinition,
  registry: DefinitionRegistry,
): number | undefined {
  for (const effect of skill.effects) {
    if (effect.type !== 'apply_tag') continue;
    const movement = findMovementFromTag(effect, registry);
    if (movement) return movement.range;
  }
  return undefined;
}

export function isMoveTagEffect(effect: ApplyTagEffect): boolean {
  return effect.tagId === 'tag_move' && effect.overrides?.move?.teleport !== true;
}
