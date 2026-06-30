import type { AttackAction, BattleEvent, BattleState } from '@dawn/types';
import { withAp, withHp } from '../../entities/Combatant';
import { getCombatant } from '../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../queries/isCombatantAlive';
import { updateMap } from '../../utils/immutable';
import type { AttackCalculation } from './calculate';

export interface AttackApplyResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

export function applyAttack(
  state: BattleState,
  action: AttackAction,
  calculated: AttackCalculation,
): AttackApplyResult {
  const combatant = getCombatant(state, action.combatantId)!;
  const target = getCombatant(state, action.targetId)!;

  const newHp = target.hp - calculated.damage;
  const updatedTarget = withHp(target, newHp);
  const updatedAttacker = withAp(combatant, combatant.ap - calculated.apCost);

  const events: BattleEvent[] = [
    {
      type: 'damage_dealt',
      sourceId: action.combatantId,
      targetId: action.targetId,
      amount: calculated.damage,
      reason: 'attack',
    },
  ];

  if (!isCombatantAlive(updatedTarget)) {
    events.push({
      type: 'combatant_killed',
      combatantId: action.targetId,
      killerId: action.combatantId,
    });
  }

  let combatants = updateMap(state.combatants, action.combatantId, updatedAttacker);
  combatants = updateMap(combatants, action.targetId, updatedTarget);

  const newState: BattleState = {
    ...state,
    combatants,
    turnActionState: {
      movesUsed: state.turnActionState.movesUsed,
      hasUsedPrimaryAction: true,
      apSpent: state.turnActionState.apSpent + calculated.apCost,
    },
  };

  return { state: newState, events };
}
