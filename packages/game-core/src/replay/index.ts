import type { BattleAction, BattleEvent, BattleState, Tile } from '@dawn/types';
import { recordToMap, mapToRecord } from '../utils/immutable';

export interface BattleRecording {
  readonly version: 1;
  readonly battleId: string;
  readonly initialState: BattleState;
  readonly actions: readonly BattleAction[];
}

export interface ReplayStep {
  readonly action: BattleAction;
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

export interface ReplayResult {
  readonly ok: boolean;
  readonly steps: readonly ReplayStep[];
  readonly finalState: BattleState | null;
  readonly error?: string;
}

interface SerializedState {
  battleId: string;
  round: number;
  turn: number;
  seed: number;
  createdAt: number;
  playerId: string;
  activeCombatantId: string | null;
  combatants: Record<
    string,
    BattleState['combatants'] extends ReadonlyMap<string, infer V> ? V : never
  >;
  grid: {
    width: number;
    height: number;
    tiles: Record<string, Tile>;
  };
  config: BattleState['config'];
  turnOrder: readonly string[];
  turnActionState: BattleState['turnActionState'];
  winner: BattleState['winner'];
  history: readonly BattleAction[];
}

function serializeState(state: BattleState): SerializedState {
  return {
    ...state,
    combatants: mapToRecord(state.combatants),
    grid: {
      width: state.grid.width,
      height: state.grid.height,
      tiles: mapToRecord(state.grid.tiles),
    },
  };
}

function deserializeState(data: SerializedState): BattleState {
  return {
    ...data,
    combatants: recordToMap(data.combatants),
    grid: {
      width: data.grid.width,
      height: data.grid.height,
      tiles: recordToMap(data.grid.tiles),
    },
  };
}

export function createRecording(initialState: BattleState): BattleRecording {
  return {
    version: 1,
    battleId: initialState.battleId,
    initialState,
    actions: [],
  };
}

export function appendAction(recording: BattleRecording, action: BattleAction): BattleRecording {
  return {
    ...recording,
    actions: [...recording.actions, action],
  };
}

export function serializeRecording(recording: BattleRecording): string {
  return JSON.stringify({
    version: recording.version,
    battleId: recording.battleId,
    initialState: serializeState(recording.initialState),
    actions: recording.actions,
  });
}

export function parseRecording(json: string): BattleRecording {
  const parsed = JSON.parse(json) as {
    version: number;
    battleId: string;
    initialState: SerializedState;
    actions: BattleAction[];
  };
  if (parsed.version !== 1) {
    throw new Error(`Unsupported recording version: ${parsed.version}`);
  }
  return {
    version: 1,
    battleId: parsed.battleId,
    initialState: deserializeState(parsed.initialState),
    actions: parsed.actions,
  };
}

export function replayRecording(
  recording: BattleRecording,
  dispatch: (
    state: BattleState,
    action: BattleAction,
  ) => {
    ok: boolean;
    state?: BattleState;
    events?: readonly BattleEvent[];
    error?: { code: string };
  },
): ReplayResult {
  let current = recording.initialState;
  const steps: ReplayStep[] = [];

  for (const action of recording.actions) {
    const result = dispatch(current, action);
    if (!result.ok || !result.state) {
      return {
        ok: false,
        steps,
        finalState: current,
        error: result.error?.code ?? 'DispatchFailed',
      };
    }
    steps.push({
      action,
      state: result.state,
      events: result.events ?? [],
    });
    current = result.state;
  }

  return { ok: true, steps, finalState: current };
}
