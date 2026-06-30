import type { BattleEvent, BattleState, EndTurnAction } from '@dawn/types';
import { restoreResources } from './restoreResources';
import { updateMap } from '../../utils/immutable';
import type { TurnCalculation } from './calculate';

export interface TurnApplyResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

const INITIAL_TURN_ACTION_STATE = {
  movesUsed: 0,
  hasAttacked: false,
  apSpent: 0,
} as const;

export function applyEndTurn(
  state: BattleState,
  action: EndTurnAction,
  calculated: TurnCalculation,
): TurnApplyResult {
  const events: BattleEvent[] = [{ type: 'turn_ended', combatantId: action.combatantId }];

  let combatants = state.combatants;
  const nextCombatant = state.combatants.get(calculated.nextCombatantId);
  if (nextCombatant) {
    const restored = restoreResources(nextCombatant, state.config);
    combatants = updateMap(combatants, calculated.nextCombatantId, restored);
    events.push({
      type: 'turn_started',
      combatantId: calculated.nextCombatantId,
      round: calculated.nextRound,
    });
  }

  const newState: BattleState = {
    ...state,
    combatants,
    activeCombatantId: calculated.nextCombatantId,
    turn: calculated.nextTurnIndex,
    round: calculated.nextRound,
    turnActionState: { ...INITIAL_TURN_ACTION_STATE },
  };

  return { state: newState, events };
}

export function startTurn(state: BattleState, combatantId: string): BattleState {
  const combatant = state.combatants.get(combatantId);
  if (!combatant) return state;

  const restored = restoreResources(combatant, state.config);
  return {
    ...state,
    combatants: updateMap(state.combatants, combatantId, restored),
    activeCombatantId: combatantId,
    turnActionState: { ...INITIAL_TURN_ACTION_STATE },
  };
}
