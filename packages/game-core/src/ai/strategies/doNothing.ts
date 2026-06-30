import type { BattleAction, BattleState } from '@dawn/types';
import { getActiveCombatant } from '../../queries/getActiveCombatant';
import type { AIStrategy } from '../types';

export const doNothingStrategy: AIStrategy = {
  id: 'do_nothing',
  name: 'Do Nothing',
  planTurn(state: BattleState): BattleAction[] {
    const active = getActiveCombatant(state);
    if (!active || active.team !== 'enemy' || state.winner !== null) {
      return [];
    }
    return [{ type: 'end_turn', combatantId: active.id }];
  },
};
