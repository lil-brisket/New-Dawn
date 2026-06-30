import type { BattleError, BattleEvent, BattleState } from '@dawn/types';
import { createId } from '@dawn/utils';

export type BattleLogEntryType = BattleEvent['type'] | 'error' | 'debug' | 'system';

export interface BattleLogEntry {
  readonly id: string;
  readonly timestamp: number;
  readonly type: BattleLogEntryType;
  readonly payload: unknown;
  readonly text: string;
}

function combatantName(state: BattleState | null, id: string): string {
  return state?.combatants.get(id)?.name ?? id;
}

export function formatEvent(event: BattleEvent, state: BattleState | null): BattleLogEntry {
  const timestamp = Date.now();
  const id = createId('log');

  switch (event.type) {
    case 'combatant_moved':
      return {
        id,
        timestamp,
        type: event.type,
        payload: event,
        text: `${combatantName(state, event.combatantId)} moved`,
      };
    case 'damage_dealt':
      return {
        id,
        timestamp,
        type: event.type,
        payload: event,
        text: `${combatantName(state, event.sourceId)} dealt ${event.amount} damage`,
      };
    case 'combatant_killed':
      return {
        id,
        timestamp,
        type: event.type,
        payload: event,
        text: `${combatantName(state, event.combatantId)} defeated`,
      };
    case 'turn_started': {
      const team = state?.combatants.get(event.combatantId)?.team;
      const label = team === 'player' ? 'Player Turn' : 'Enemy Turn';
      return {
        id,
        timestamp,
        type: event.type,
        payload: event,
        text: label,
      };
    }
    case 'turn_ended':
      return {
        id,
        timestamp,
        type: event.type,
        payload: event,
        text: `${combatantName(state, event.combatantId)} ended turn`,
      };
    case 'battle_won': {
      const label = event.team === 'player' ? 'Victory' : 'Defeat';
      return {
        id,
        timestamp,
        type: event.type,
        payload: event,
        text: label,
      };
    }
    default:
      return {
        id,
        timestamp,
        type: 'system',
        payload: event,
        text: 'Unknown event',
      };
  }
}

export function formatEvents(
  events: readonly BattleEvent[],
  state: BattleState | null,
): BattleLogEntry[] {
  return events.map((e) => formatEvent(e, state));
}

export function createSystemLog(text: string, type: BattleLogEntryType = 'system'): BattleLogEntry {
  return {
    id: createId('log'),
    timestamp: Date.now(),
    type,
    payload: null,
    text,
  };
}

export function createErrorLog(error: BattleError): BattleLogEntry {
  return {
    id: createId('log'),
    timestamp: Date.now(),
    type: 'error',
    payload: error,
    text: `Error: ${error.code}`,
  };
}
