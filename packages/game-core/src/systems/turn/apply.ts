import type { BattleEvent, BattleState, EndTurnAction } from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { restoreResources } from './restoreResources';
import { updateMap } from '../../utils/immutable';
import type { TurnCalculation } from './calculate';
import { tickStatuses, decayStatuses, decrementCooldowns } from '../status/tickStatuses';

export interface TurnApplyResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

const INITIAL_TURN_ACTION_STATE = {
  movesUsed: 0,
  hasUsedPrimaryAction: false,
  apSpent: 0,
} as const;

export function applyEndTurn(
  state: BattleState,
  action: EndTurnAction,
  calculated: TurnCalculation,
): TurnApplyResult {
  const events: BattleEvent[] = [{ type: 'turn_ended', combatantId: action.combatantId }];

  let currentState = state;
  const decayResult = decayStatuses(currentState, action.combatantId, defaultRegistry);
  currentState = decayResult.state;
  events.push(...decayResult.events);

  currentState = decrementCooldowns(currentState, action.combatantId);

  let combatants = currentState.combatants;
  const nextCombatant = currentState.combatants.get(calculated.nextCombatantId);
  if (nextCombatant) {
    const restored = restoreResources(nextCombatant, currentState.config);
    combatants = updateMap(combatants, calculated.nextCombatantId, restored);

    let tickState: BattleState = { ...currentState, combatants };
    const tickResult = tickStatuses(tickState, calculated.nextCombatantId, defaultRegistry);
    tickState = tickResult.state;
    events.push(...tickResult.events);
    combatants = tickState.combatants;

    events.push({
      type: 'turn_started',
      combatantId: calculated.nextCombatantId,
      round: calculated.nextRound,
    });
  }

  const newState: BattleState = {
    ...currentState,
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
