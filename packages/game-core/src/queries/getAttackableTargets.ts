import type { BattleState, Combatant } from '@dawn/types';
import { distance } from '../grid/HexMath';
import { isEnemy } from '../entities/Team';
import { getCombatant } from './getActiveCombatant';
import { isCombatantAlive } from './isCombatantAlive';

export function getAttackableTargets(state: BattleState, combatantId: string): Combatant[] {
  if (state.winner !== null) return [];

  const combatant = getCombatant(state, combatantId);
  if (!combatant || !isCombatantAlive(combatant)) return [];

  if (state.activeCombatantId !== combatantId) return [];

  if (state.turnActionState.hasUsedPrimaryAction) return [];

  const { config } = state;
  if (combatant.ap < config.attackCost) return [];

  const targets: Combatant[] = [];
  for (const candidate of state.combatants.values()) {
    if (!isCombatantAlive(candidate)) continue;
    if (!isEnemy(combatant.team, candidate.team)) continue;
    const dist = distance(combatant.position, candidate.position);
    if (dist <= config.attackRange) {
      targets.push(candidate);
    }
  }

  return targets;
}

export function isAttackableTarget(
  state: BattleState,
  combatantId: string,
  targetId: string,
): boolean {
  return getAttackableTargets(state, combatantId).some((t) => t.id === targetId);
}
