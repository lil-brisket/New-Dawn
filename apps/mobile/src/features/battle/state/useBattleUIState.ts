import { useCallback, useReducer } from 'react';
import {
  battleUIReducer,
  INITIAL_BATTLE_UI_STATE,
  type BattleUIAction,
  type BattleUIState,
} from './BattleUIState';

export function useBattleUIState(initial?: Partial<BattleUIState>) {
  const [state, dispatch] = useReducer(battleUIReducer, {
    ...INITIAL_BATTLE_UI_STATE,
    ...initial,
  });

  const setUI = useCallback((action: BattleUIAction) => dispatch(action), []);

  return { uiState: state, setUI, dispatch };
}

export type { BattleUIState, BattleUIAction };
