import { useEffect, useRef } from 'react';
import type { BattleAction, BattleState } from '@dawn/types';
import { getActiveCombatant, getStrategy, planTurn } from '@dawn/game-core';
import type { DispatchResult } from './useBattle';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface UseEnemyTurnOptions {
  battleState: BattleState | null;
  dispatch: (action: BattleAction) => DispatchResult;
  aiSpeedMs: number;
  strategyId: string;
  enabled: boolean;
}

function getEnemyTurnKey(state: BattleState): string | null {
  const active = getActiveCombatant(state);
  if (!active || active.team !== 'enemy' || state.winner !== null) {
    return null;
  }
  return `${state.round}-${state.turn}-${active.id}`;
}

export function useEnemyTurn({
  battleState,
  dispatch,
  aiSpeedMs,
  strategyId,
  enabled,
}: UseEnemyTurnOptions) {
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  const battleStateRef = useRef(battleState);
  battleStateRef.current = battleState;

  const completedTurnsRef = useRef(new Set<string>());
  const battleIdRef = useRef<string | null>(null);
  const runnerKeyRef = useRef<string | null>(null);

  const enemyTurnKey = battleState ? getEnemyTurnKey(battleState) : null;

  useEffect(() => {
    if (!battleState) return;
    if (battleIdRef.current !== battleState.battleId) {
      battleIdRef.current = battleState.battleId;
      completedTurnsRef.current.clear();
      runnerKeyRef.current = null;
    }
  }, [battleState?.battleId]);

  useEffect(() => {
    if (!enabled || !enemyTurnKey) {
      return;
    }

    if (completedTurnsRef.current.has(enemyTurnKey)) {
      return;
    }

    if (runnerKeyRef.current === enemyTurnKey) {
      return;
    }

    const state = battleStateRef.current;
    if (!state || getEnemyTurnKey(state) !== enemyTurnKey) {
      return;
    }

    runnerKeyRef.current = enemyTurnKey;
    const strategy = getStrategy(strategyId);
    const actions = planTurn(state, strategy);
    let cancelled = false;

    void (async () => {
      try {
        for (const action of actions) {
          if (cancelled) {
            return;
          }
          if (aiSpeedMs > 0) {
            await delay(aiSpeedMs);
          }
          dispatchRef.current(action);
        }
        if (!cancelled) {
          completedTurnsRef.current.add(enemyTurnKey);
        }
      } finally {
        if (runnerKeyRef.current === enemyTurnKey) {
          runnerKeyRef.current = null;
        }
      }
    })();

    return () => {
      cancelled = true;
      if (runnerKeyRef.current === enemyTurnKey) {
        runnerKeyRef.current = null;
      }
    };
  }, [enabled, enemyTurnKey, aiSpeedMs, strategyId]);
}
