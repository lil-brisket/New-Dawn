import { useCallback, useRef } from 'react';
import { BattleEngine } from '@dawn/game-core';
import { defaultRegistry } from '@dawn/game-data';
import { createTestClock, createSeededRandom } from '@dawn/utils';
import type { BattleCommand, BattleState } from '@dawn/types';
import { useBattleStore } from '@/stores/battleStore';
import { useBattleAnimations } from '../presentation/useBattleAnimations';

export function useBattleEngine(initialState?: BattleState) {
  const engineRef = useRef<BattleEngine | null>(null);

  if (!engineRef.current && initialState) {
    engineRef.current = new BattleEngine(initialState, {
      clock: createTestClock(),
      random: createSeededRandom(42),
      definitions: defaultRegistry,
    });
  }

  useBattleAnimations(engineRef.current?.getEventBus() ?? null);

  const submitCommand = useCallback((command: BattleCommand) => {
    if (!engineRef.current) return null;
    const result = engineRef.current.submitCommand(command);
    useBattleStore.getState().setSnapshot(engineRef.current.getSnapshot());
    useBattleStore.getState().setBattleLog([...engineRef.current.getBattleLog()]);
    return result;
  }, []);

  return { engine: engineRef.current, submitCommand };
}
