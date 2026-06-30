import type { BattleEvent, BattleState, MoveAction } from '@dawn/types';
import { withAp, withPosition } from '../../entities/Combatant';
import { getCombatant } from '../../queries/getActiveCombatant';
import { updateMap } from '../../utils/immutable';
import type { MoveCalculation } from './calculate';

export interface MoveApplyResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

export function applyMove(
  state: BattleState,
  action: MoveAction,
  calculated: MoveCalculation,
): MoveApplyResult {
  const combatant = getCombatant(state, action.combatantId)!;
  const from = combatant.position;
  const to = action.destination;

  const updated = withAp(withPosition(combatant, to), combatant.ap - calculated.apCost);

  const newState: BattleState = {
    ...state,
    combatants: updateMap(state.combatants, action.combatantId, updated),
    turnActionState: {
      movesUsed: state.turnActionState.movesUsed + 1,
      hasUsedPrimaryAction: state.turnActionState.hasUsedPrimaryAction,
      apSpent: state.turnActionState.apSpent + calculated.apCost,
    },
  };

  const events: BattleEvent[] = [
    { type: 'combatant_moved', combatantId: action.combatantId, from, to },
  ];

  return { state: newState, events };
}
