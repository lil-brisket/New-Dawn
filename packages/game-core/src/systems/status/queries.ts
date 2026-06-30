import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleState, StatusInstance } from '@dawn/types';
import { getCombatant } from '../../queries/getActiveCombatant';

export function getStatusesForCombatant(
  state: BattleState,
  combatantId: string,
): readonly StatusInstance[] {
  return getCombatant(state, combatantId)?.statuses ?? [];
}

export interface StatusDisplayInfo {
  readonly id: string;
  readonly statusDefinitionId: string;
  readonly name: string;
  readonly iconId: string;
  readonly remainingTurns: number;
  readonly stacks: number;
}

export function getStatusDisplays(
  state: BattleState,
  combatantId: string,
  registry: DefinitionRegistry,
): StatusDisplayInfo[] {
  const statuses = getStatusesForCombatant(state, combatantId);
  return statuses.map((instance) => {
    const def = registry.getStatus(instance.statusDefinitionId);
    return {
      id: instance.id,
      statusDefinitionId: instance.statusDefinitionId,
      name: def?.name ?? instance.statusDefinitionId,
      iconId: def?.iconId ?? 'icon_unknown',
      remainingTurns: instance.remainingTurns,
      stacks: instance.stacks,
    };
  });
}
