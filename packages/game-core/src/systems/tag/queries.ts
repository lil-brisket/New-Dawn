import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleState, TagInstance } from '@dawn/types';
import { getCombatant } from '../../queries/getActiveCombatant';

export function getTagsForCombatant(
  state: BattleState,
  combatantId: string,
): readonly TagInstance[] {
  return getCombatant(state, combatantId)?.tags ?? [];
}

export interface TagDisplayInfo {
  readonly id: string;
  readonly tagDefinitionId: string;
  readonly name: string;
  readonly iconId: string;
  readonly remainingTurns: number;
  readonly stacks: number;
}

export function getTagDisplays(
  state: BattleState,
  combatantId: string,
  registry: DefinitionRegistry,
): TagDisplayInfo[] {
  const tags = getTagsForCombatant(state, combatantId);
  return tags.map((instance) => {
    const def = registry.getTag(instance.tagDefinitionId);
    return {
      id: instance.id,
      tagDefinitionId: instance.tagDefinitionId,
      name: def?.name ?? instance.tagDefinitionId,
      iconId: def?.iconId ?? 'icon_unknown',
      remainingTurns: instance.remainingTurns,
      stacks: instance.stacks,
    };
  });
}

/** @deprecated Use getTagsForCombatant */
export const getStatusesForCombatant = getTagsForCombatant;

/** @deprecated Use getTagDisplays */
export const getStatusDisplays = getTagDisplays;

export type StatusDisplayInfo = TagDisplayInfo;
