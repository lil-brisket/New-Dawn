import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState, MoveAction } from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { withAp, withPosition } from '../../entities/Combatant';
import { getCombatant } from '../../queries/getActiveCombatant';
import { updateMap } from '../../utils/immutable';
import { getBattleRng } from '../../utils/battleRng';
import { dispatchStatusTriggers } from '../status/dispatchTriggers';
import type { MoveCalculation } from './calculate';

export interface MoveApplyResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

export function applyMove(
  state: BattleState,
  action: MoveAction,
  calculated: MoveCalculation,
  registry: DefinitionRegistry = defaultRegistry,
): MoveApplyResult {
  const combatant = getCombatant(state, action.combatantId)!;
  const from = combatant.position;
  const to = action.destination;

  const updated = withAp(withPosition(combatant, to), combatant.ap - calculated.apCost);

  let newState: BattleState = {
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

  const triggerResult = dispatchStatusTriggers(
    newState,
    action.combatantId,
    'on_move',
    registry,
    getBattleRng(state),
  );
  newState = triggerResult.state;
  events.push(...triggerResult.events);

  return { state: newState, events };
}
