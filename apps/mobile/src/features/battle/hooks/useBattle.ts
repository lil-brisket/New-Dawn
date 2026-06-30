import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BattleAction, BattleError, BattleEvent, BattleState } from '@dawn/types';
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
  sandboxSetSp,
  sandboxClearCooldowns,
  sandboxApplyAllStatuses,
  sandboxSpawnDummy,
  getValidTargets,
  getTargetTiles,
  needsTileTarget,
  defaultRegistry,
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

export type BattleMode = 'idle' | 'move' | 'attack' | 'skill';

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
  const [loadError, setLoadError] = useState<BattleError | null>(null);
  const [stateHistory, setStateHistory] = useState<BattleState[]>([]);
  const [recording, setRecording] = useState<BattleRecording | null>(null);
  const [selectedCombatantId, setSelectedCombatantId] = useState<string | null>(null);
  const [mode, setMode] = useState<BattleMode>('idle');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
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
      setLoadError(result.error);
      setLogEntries([createErrorLog(result.error)]);
      return;
    }
    setLoadError(null);
    setBattleState(result.state);
    setStateHistory([]);
    setRecording(createRecording(result.state));
    setSelectedCombatantId(null);
    setMode('idle');
    setSelectedSkillId(null);
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
    battleStateRef.current = next;
    setMode('idle');
    setSelectedSkillId(null);
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

      const active = getActiveCombatant(battleState);
      if (isPlayerTurn(battleState) && active?.team === 'player' && active.id !== combatantId) {
        return;
      }

      setSelectedCombatantId(combatantId);
      setMode('idle');
    },
    [battleState],
  );

  const handleTilePress = useCallback(
    (coord: { x: number; y: number; z: number }) => {
      const currentState = battleStateRef.current;
      if (!currentState || !currentState.activeCombatantId || currentState.winner !== null) {
        return;
      }

      const active = getActiveCombatant(currentState);
      if (!active || active.id !== currentState.activeCombatantId) return;
      if (active.team !== 'player') return;

      if (mode === 'move') {
        if (canMoveTo(currentState, active.id, coord)) {
          dispatch({
            type: 'move',
            combatantId: active.id,
            destination: coord,
          });
        }
      } else if (mode === 'attack') {
        const targets = getAttackableTargets(currentState, active.id);
        const target = targets.find(
          (t) => t.position.x === coord.x && t.position.y === coord.y && t.position.z === coord.z,
        );
        if (target) {
          dispatch({
            type: 'attack',
            combatantId: active.id,
            targetId: target.id,
          });
        }
      } else if (mode === 'skill' && selectedSkillId) {
        const skill = defaultRegistry.getSkill(selectedSkillId);
        if (!skill) return;

        if (needsTileTarget(skill)) {
          dispatch({
            type: 'skill',
            combatantId: active.id,
            skillId: selectedSkillId,
            destination: coord,
          });
        } else {
          const targets = getValidTargets(currentState, skill, active.id);
          const target = targets.find((id) => {
            const unit = currentState.combatants.get(id);
            return (
              unit &&
              unit.position.x === coord.x &&
              unit.position.y === coord.y &&
              unit.position.z === coord.z
            );
          });
          if (target) {
            dispatch({
              type: 'skill',
              combatantId: active.id,
              skillId: selectedSkillId,
              targetId: target,
            });
          }
        }
      }
    },
    [mode, dispatch, selectedSkillId],
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

  const infiniteSp = useCallback(() => {
    if (!battleState?.activeCombatantId) return;
    applySandbox((s) => sandboxSetSp(s, battleState.activeCombatantId!));
  }, [battleState?.activeCombatantId, applySandbox]);

  const clearCooldowns = useCallback(() => {
    if (!battleState?.activeCombatantId) return;
    applySandbox((s) => sandboxClearCooldowns(s, battleState.activeCombatantId!));
  }, [battleState?.activeCombatantId, applySandbox]);

  const applyAllStatuses = useCallback(() => {
    const id = selectedCombatantId ?? battleState?.activeCombatantId;
    if (!id) return;
    applySandbox((s) => sandboxApplyAllStatuses(s, id));
  }, [selectedCombatantId, battleState?.activeCombatantId, applySandbox]);

  const spawnDummy = useCallback(() => {
    if (!battleState) return;
    const active = getActiveCombatant(battleState);
    const pos = active?.position ?? { x: 0, y: 0, z: 0 };
    applySandbox((s) => sandboxSpawnDummy(s, pos));
  }, [battleState, applySandbox]);

  const castSelfSkill = useCallback(
    (skillId: string) => {
      if (!battleState?.activeCombatantId) return;
      dispatch({
        type: 'skill',
        combatantId: battleState.activeCombatantId,
        skillId,
      });
    },
    [battleState?.activeCombatantId, dispatch],
  );

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

  const actingPlayerId =
    playerTurn && battleState?.activeCombatantId
      ? battleState.activeCombatantId
      : selectedCombatantId;

  useEffect(() => {
    if (!battleState || !playerTurn) return;
    const active = getActiveCombatant(battleState);
    if (active?.team === 'player' && active.id !== selectedCombatantId) {
      setSelectedCombatantId(active.id);
      setMode('idle');
    }
  }, [battleState, battleState?.activeCombatantId, playerTurn, selectedCombatantId]);

  const reachableTileCosts = useMemo(() => {
    if (!battleState || !actingPlayerId) return [];
    if (mode !== 'move' && !debugSettings.showReachable) return [];
    const id =
      mode === 'move' && activeCombatant?.id === actingPlayerId
        ? actingPlayerId
        : debugSettings.showReachable
          ? (activeCombatant?.id ?? actingPlayerId)
          : actingPlayerId;
    return getReachableTileCosts(battleState, id);
  }, [battleState, actingPlayerId, mode, debugSettings.showReachable, activeCombatant]);

  const attackableTargets = useMemo(() => {
    if (!battleState || !actingPlayerId || mode !== 'attack') return [];
    return getAttackableTargets(battleState, actingPlayerId);
  }, [battleState, actingPlayerId, mode]);

  const attackRangeTiles = useMemo(() => {
    if (!battleState || !actingPlayerId || mode !== 'attack') return [];
    return getAttackRangeTiles(battleState, actingPlayerId);
  }, [battleState, actingPlayerId, mode]);

  const skillTargetIds = useMemo(() => {
    if (!battleState || !actingPlayerId || mode !== 'skill' || !selectedSkillId) return [];
    const skill = defaultRegistry.getSkill(selectedSkillId);
    if (!skill) return [];
    return getValidTargets(battleState, skill, actingPlayerId);
  }, [battleState, actingPlayerId, mode, selectedSkillId]);

  const skillTargetTiles = useMemo(() => {
    if (!battleState || !actingPlayerId || mode !== 'skill' || !selectedSkillId) return [];
    const skill = defaultRegistry.getSkill(selectedSkillId);
    if (!skill) return [];
    return getTargetTiles(battleState, skill, actingPlayerId);
  }, [battleState, actingPlayerId, mode, selectedSkillId]);

  const selectSkill = useCallback((skillId: string | null) => {
    setSelectedSkillId(skillId);
    setMode(skillId ? 'skill' : 'idle');
  }, []);

  return {
    battleState,
    loadError,
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
    selectedSkillId,
    selectSkill,
    castSelfSkill,
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
    skillTargetIds,
    skillTargetTiles,
    infiniteSp,
    clearCooldowns,
    applyAllStatuses,
    spawnDummy,
  };
}
