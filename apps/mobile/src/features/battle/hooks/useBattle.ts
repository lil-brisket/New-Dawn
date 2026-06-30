import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BattleAction, BattleEvent, BattleState } from '@dawn/types';
import {
  appendAction,
  canMoveTo,
  createRecording,
  dispatchAction,
  getActiveCombatant,
  getAttackableTargets,
  getAttackRangeTiles,
  getReachableTileCosts,
  isPlayerTurn,
  replayRecording,
  sandboxAdvanceTurns,
  sandboxForceHeal,
  sandboxForceKill,
  sandboxSkipRound,
  serializeRecording,
  type BattleRecording,
} from '@dawn/game-core';
import {
  BATTLE_DEFINITIONS,
  getBattleDefinition,
  startBattle,
  type BattleDefinition,
} from '../sandbox/battles';
import {
  createErrorLog,
  createSystemLog,
  formatEvents,
  type BattleLogEntry,
} from '../sandbox/battleLog';

export type BattleMode = 'idle' | 'move' | 'attack';

export interface DebugSettings {
  showCoords: boolean;
  showReachable: boolean;
  showGrid: boolean;
  aiSpeedMs: number;
}

const DEFAULT_DEBUG: DebugSettings = {
  showCoords: false,
  showReachable: false,
  showGrid: false,
  aiSpeedMs: 300,
};

export type DispatchResult =
  | { ok: true; state: BattleState; events: readonly BattleEvent[] }
  | { ok: false; error: { code: string } };

function applyMutation(
  prevState: BattleState,
  nextState: BattleState,
  events: readonly BattleEvent[],
  recording: BattleRecording,
  action: BattleAction | null,
  setStateHistory: (fn: (h: BattleState[]) => BattleState[]) => void,
  setRecording: (fn: (r: BattleRecording | null) => BattleRecording | null) => void,
  setLogEntries: (fn: (e: BattleLogEntry[]) => BattleLogEntry[]) => void,
): BattleState {
  setStateHistory((h) => [...h, prevState]);
  if (action) {
    setRecording((r) => (r ? appendAction(r, action) : r));
  }
  setLogEntries((entries) => [...entries, ...formatEvents(events, nextState)]);
  return nextState;
}

export function useBattle(initialBattleId = 'training') {
  const [battleDefinitionId, setBattleDefinitionId] = useState(initialBattleId);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [stateHistory, setStateHistory] = useState<BattleState[]>([]);
  const [recording, setRecording] = useState<BattleRecording | null>(null);
  const [selectedCombatantId, setSelectedCombatantId] = useState<string | null>(null);
  const [mode, setMode] = useState<BattleMode>('idle');
  const [logEntries, setLogEntries] = useState<BattleLogEntry[]>([]);
  const [debugSettings, setDebugSettings] = useState<DebugSettings>(DEFAULT_DEBUG);
  const [lastReplayVerify, setLastReplayVerify] = useState<string | null>(null);

  const battleStateRef = useRef(battleState);
  const recordingRef = useRef(recording);
  battleStateRef.current = battleState;
  recordingRef.current = recording;

  const battleDefinition = useMemo(
    () => getBattleDefinition(battleDefinitionId) ?? BATTLE_DEFINITIONS[0]!,
    [battleDefinitionId],
  );

  const loadBattle = useCallback((def: BattleDefinition) => {
    const result = startBattle(def);
    if (!result.ok) {
      setLogEntries([createErrorLog(result.error)]);
      return;
    }
    setBattleState(result.state);
    setStateHistory([]);
    setRecording(createRecording(result.state));
    setSelectedCombatantId(null);
    setMode('idle');
    setLogEntries(formatEvents(result.events, result.state));
    setBattleDefinitionId(def.id);
    setLastReplayVerify(null);
  }, []);

  const restart = useCallback(() => {
    loadBattle(battleDefinition);
  }, [battleDefinition, loadBattle]);

  const initIfNeeded = useCallback(() => {
    if (!battleState) {
      loadBattle(battleDefinition);
    }
  }, [battleState, battleDefinition, loadBattle]);

  const dispatch = useCallback((action: BattleAction): DispatchResult => {
    const currentState = battleStateRef.current;
    const currentRecording = recordingRef.current;
    if (!currentState) return { ok: false, error: { code: 'NoState' } };

    const result = dispatchAction(currentState, action);
    if (!result.ok) {
      setLogEntries((e) => [...e, createErrorLog(result.error)]);
      return result;
    }

    const rec = currentRecording ?? createRecording(currentState);
    const next = applyMutation(
      currentState,
      result.state,
      result.events,
      rec,
      action,
      setStateHistory,
      setRecording,
      setLogEntries,
    );
    setBattleState(next);
    setMode('idle');
    return result;
  }, []);

  const applySandbox = useCallback(
    (
      mutator: (state: BattleState) => {
        ok: boolean;
        state?: BattleState;
        events?: readonly BattleEvent[];
        error?: string;
      },
    ): boolean => {
      const currentState = battleStateRef.current;
      const currentRecording = recordingRef.current;
      if (!currentState) return false;
      const result = mutator(currentState);
      if (!result.ok || !result.state) {
        setLogEntries((e) => [
          ...e,
          createSystemLog(result.error ?? 'Sandbox action failed', 'error'),
        ]);
        return false;
      }
      const rec = currentRecording ?? createRecording(currentState);
      const next = applyMutation(
        currentState,
        result.state,
        result.events ?? [],
        rec,
        null,
        setStateHistory,
        setRecording,
        setLogEntries,
      );
      setBattleState(next);
      return true;
    },
    [],
  );

  const undo = useCallback(() => {
    if (stateHistory.length === 0 || !recording) return;
    const previous = stateHistory[stateHistory.length - 1]!;
    setStateHistory((h) => h.slice(0, -1));
    setBattleState(previous);
    setRecording({
      ...recording,
      actions: recording.actions.slice(0, -1),
    });
    setMode('idle');
    setLogEntries((e) => [...e, createSystemLog('Undo', 'debug')]);
  }, [stateHistory, recording]);

  const selectUnit = useCallback(
    (combatantId: string) => {
      if (!battleState) return;
      const unit = battleState.combatants.get(combatantId);
      if (!unit || unit.team !== 'player') return;
      setSelectedCombatantId(combatantId);
      setMode('idle');
    },
    [battleState],
  );

  const handleTilePress = useCallback(
    (coord: { x: number; y: number; z: number }) => {
      if (!battleState || !selectedCombatantId || battleState.winner !== null) return;

      const active = getActiveCombatant(battleState);
      if (!active || active.id !== selectedCombatantId) return;

      if (mode === 'move') {
        if (canMoveTo(battleState, selectedCombatantId, coord)) {
          dispatch({
            type: 'move',
            combatantId: selectedCombatantId,
            destination: coord,
          });
        }
      } else if (mode === 'attack') {
        const targets = getAttackableTargets(battleState, selectedCombatantId);
        const target = targets.find(
          (t) => t.position.x === coord.x && t.position.y === coord.y && t.position.z === coord.z,
        );
        if (target) {
          dispatch({
            type: 'attack',
            combatantId: selectedCombatantId,
            targetId: target.id,
          });
        }
      }
    },
    [battleState, selectedCombatantId, mode, dispatch],
  );

  const endTurn = useCallback(() => {
    if (!battleState?.activeCombatantId) return;
    dispatch({ type: 'end_turn', combatantId: battleState.activeCombatantId });
  }, [battleState, dispatch]);

  const killSelected = useCallback(() => {
    if (!selectedCombatantId) return;
    applySandbox((s) => sandboxForceKill(s, selectedCombatantId));
  }, [selectedCombatantId, applySandbox]);

  const healSelected = useCallback(() => {
    if (!selectedCombatantId) return;
    applySandbox((s) => sandboxForceHeal(s, selectedCombatantId));
  }, [selectedCombatantId, applySandbox]);

  const advanceTurns = useCallback(
    (count: number) => {
      applySandbox((s) => sandboxAdvanceTurns(s, count));
    },
    [applySandbox],
  );

  const skipRound = useCallback(() => {
    applySandbox((s) => sandboxSkipRound(s));
  }, [applySandbox]);

  const exportReplay = useCallback((): string | null => {
    if (!recording) return null;
    return serializeRecording(recording);
  }, [recording]);

  const verifyReplay = useCallback((): boolean => {
    if (!recording || !battleState) return false;
    const result = replayRecording(recording, (state, action) => {
      const r = dispatchAction(state, action);
      if (!r.ok) return { ok: false, error: r.error };
      return { ok: true, state: r.state, events: r.events };
    });
    const match =
      result.ok &&
      result.finalState !== null &&
      result.finalState.battleId === battleState.battleId &&
      result.finalState.round === battleState.round &&
      result.finalState.turn === battleState.turn &&
      result.finalState.winner === battleState.winner;
    setLastReplayVerify(
      match ? 'Replay verified' : `Replay mismatch: ${result.error ?? 'state diff'}`,
    );
    return match;
  }, [recording, battleState]);

  const activeCombatant = battleState ? getActiveCombatant(battleState) : undefined;
  const playerTurn = battleState ? isPlayerTurn(battleState) : false;

  useEffect(() => {
    if (!battleState || !playerTurn) return;
    const active = getActiveCombatant(battleState);
    if (active?.team === 'player' && active.id !== selectedCombatantId) {
      setSelectedCombatantId(active.id);
      setMode('idle');
    }
  }, [battleState, battleState?.activeCombatantId, playerTurn, selectedCombatantId]);

  const reachableTileCosts = useMemo(() => {
    if (!battleState || !selectedCombatantId) return [];
    if (mode !== 'move' && !debugSettings.showReachable) return [];
    const id =
      mode === 'move' && activeCombatant?.id === selectedCombatantId
        ? selectedCombatantId
        : debugSettings.showReachable
          ? (activeCombatant?.id ?? selectedCombatantId)
          : selectedCombatantId;
    return getReachableTileCosts(battleState, id);
  }, [battleState, selectedCombatantId, mode, debugSettings.showReachable, activeCombatant]);

  const attackableTargets = useMemo(() => {
    if (!battleState || !selectedCombatantId || mode !== 'attack') return [];
    return getAttackableTargets(battleState, selectedCombatantId);
  }, [battleState, selectedCombatantId, mode]);

  const attackRangeTiles = useMemo(() => {
    if (!battleState || !selectedCombatantId || mode !== 'attack') return [];
    return getAttackRangeTiles(battleState, selectedCombatantId);
  }, [battleState, selectedCombatantId, mode]);

  return {
    battleState,
    battleDefinition,
    battleDefinitionId,
    setBattleDefinitionId: (id: string) => {
      const def = getBattleDefinition(id);
      if (def) loadBattle(def);
    },
    battleDefinitions: BATTLE_DEFINITIONS,
    stateHistory,
    recording,
    selectedCombatantId,
    setSelectedCombatantId: selectUnit,
    mode,
    setMode,
    logEntries,
    debugSettings,
    setDebugSettings,
    lastReplayVerify,
    initIfNeeded,
    loadBattle,
    restart,
    dispatch,
    undo,
    handleTilePress,
    endTurn,
    killSelected,
    healSelected,
    advanceTurns,
    skipRound,
    exportReplay,
    verifyReplay,
    activeCombatant,
    playerTurn,
    reachableTileCosts,
    attackableTargets,
    attackRangeTiles,
  };
}
