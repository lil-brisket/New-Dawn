import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useBattle } from '../hooks/useBattle';
import { useEnemyTurn } from '../hooks/useEnemyTurn';

export type BattleContextValue = ReturnType<typeof useBattle>;

const BattleContext = createContext<BattleContextValue | null>(null);

export function useBattleContext(): BattleContextValue {
  const ctx = useContext(BattleContext);
  if (!ctx) {
    throw new Error('useBattleContext must be used within BattleProvider');
  }
  return ctx;
}

export interface BattleProviderProps {
  initialBattleId?: string;
  children: ReactNode;
}

export function BattleProvider({ initialBattleId = 'training', children }: BattleProviderProps) {
  const battle = useBattle(initialBattleId);

  useEffect(() => {
    battle.initIfNeeded();
  }, [battle.initIfNeeded]);

  useEnemyTurn({
    battleState: battle.battleState,
    dispatch: battle.dispatch,
    aiSpeedMs: battle.debugSettings.aiSpeedMs,
    strategyId: battle.battleDefinition.defaultEnemyStrategy,
    enabled: true,
  });

  return <BattleContext.Provider value={battle}>{children}</BattleContext.Provider>;
}
