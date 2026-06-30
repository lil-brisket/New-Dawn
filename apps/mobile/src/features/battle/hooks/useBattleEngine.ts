import { useCallback } from 'react';
import { dispatchAction } from '@dawn/game-core';
import type { BattleAction, BattleState } from '@dawn/types';
import { useBattleStore } from '@/stores/battleStore';

export function useBattleEngine(initialState?: BattleState) {
  const snapshot = useBattleStore((s) => s.snapshot);
  const setSnapshot = useBattleStore((s) => s.setSnapshot);
  const setLastEvents = useBattleStore((s) => s.setLastEvents);

  if (initialState && !snapshot) {
    setSnapshot(initialState);
  }

  const submitAction = useCallback(
    (action: BattleAction) => {
      const state = useBattleStore.getState().snapshot;
      if (!state) return null;

      const result = dispatchAction(state, action);
      if (result.ok) {
        setSnapshot(result.state);
        setLastEvents([...result.events]);
      }
      return result;
    },
    [setSnapshot, setLastEvents],
  );

  return { state: snapshot, submitAction };
}
