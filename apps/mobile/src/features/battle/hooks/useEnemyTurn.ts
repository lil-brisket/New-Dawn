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

export function useEnemyTurn({
  battleState,
  dispatch,
  aiSpeedMs,
  strategyId,
  enabled,
}: UseEnemyTurnOptions) {
  const runningRef = useRef(false);
  const turnKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !battleState || battleState.winner !== null) {
      turnKeyRef.current = null;
      return;
    }

    const active = getActiveCombatant(battleState);
    if (!active || active.team !== 'enemy') {
      turnKeyRef.current = null;
      return;
    }

    const turnKey = `${battleState.turn}-${active.id}`;
    if (turnKeyRef.current === turnKey || runningRef.current) return;

    turnKeyRef.current = turnKey;
    runningRef.current = true;

    const strategy = getStrategy(strategyId);
    const actions = planTurn(battleState, strategy);
    let cancelled = false;

    void (async () => {
      for (const action of actions) {
        if (cancelled) break;
        if (aiSpeedMs > 0) {
          await delay(aiSpeedMs);
        }
        const result = dispatch(action);
        if (!result.ok) break;
      }
      runningRef.current = false;
    })();

    return () => {
      cancelled = true;
    };
  }, [battleState, dispatch, aiSpeedMs, strategyId, enabled]);
}
