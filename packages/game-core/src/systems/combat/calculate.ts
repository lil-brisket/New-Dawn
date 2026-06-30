import type { AttackAction, BattleState } from '@dawn/types';
import { getCombatant } from '../../queries/getActiveCombatant';
import { calculateDamage } from './Damage';

export interface AttackCalculation {
  readonly damage: number;
  readonly apCost: number;
}

export function calculateAttack(state: BattleState, action: AttackAction): AttackCalculation {
  const combatant = getCombatant(state, action.combatantId)!;
  const target = getCombatant(state, action.targetId)!;

  return {
    damage: calculateDamage(combatant.attack, target.defense),
    apCost: state.config.attackCost,
  };
}
