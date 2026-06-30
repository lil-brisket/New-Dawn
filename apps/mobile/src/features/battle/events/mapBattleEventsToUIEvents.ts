import type { BattleEvent, BattleState } from '@dawn/types';
import { createId } from '@dawn/utils';
import { BattleAssets } from '../assets/BattleAssets';
import type { BattleUIEvent } from './BattleUIEvent';

const MAX_DURATION = 250;

function combatantName(state: BattleState | null, id: string): string {
  return state?.combatants.get(id)?.name ?? id;
}

function makeEvent(
  partial: Omit<BattleUIEvent, 'id' | 'timestamp' | 'round'>,
  state: BattleState | null,
  roundOverride?: number,
): BattleUIEvent {
  return {
    id: createId('ui'),
    timestamp: Date.now(),
    round: roundOverride ?? state?.round ?? 1,
    ...partial,
  };
}

function mapSingleEvent(event: BattleEvent, state: BattleState | null): BattleUIEvent[] {
  switch (event.type) {
    case 'combatant_moved':
      return [
        makeEvent(
          {
            type: 'move',
            icon: BattleAssets.icons.move,
            title: 'Moved',
            description: `${combatantName(state, event.combatantId)} moved`,
            color: 'primary',
            priority: 1,
            payload: { combatantId: event.combatantId },
            duration: MAX_DURATION,
          },
          state,
        ),
      ];
    case 'damage_dealt':
      return [
        makeEvent(
          {
            type: 'damage',
            icon: BattleAssets.icons.attack,
            title: event.reason === 'skill' ? 'Skill Damage' : 'Damage',
            description: `${combatantName(state, event.sourceId)} dealt ${event.amount} damage`,
            color: 'error',
            priority: 3,
            payload: {
              amount: event.amount,
              sourceId: event.sourceId,
              targetId: event.targetId,
              skillId: event.skillId,
            },
            duration: MAX_DURATION,
          },
          state,
        ),
      ];
    case 'heal_applied':
      return [
        makeEvent(
          {
            type: 'heal',
            icon: BattleAssets.icons.item,
            title: 'Heal',
            description: `${combatantName(state, event.sourceId)} healed ${event.amount} HP`,
            color: 'success',
            priority: 2,
            payload: {
              amount: event.amount,
              sourceId: event.sourceId,
              targetId: event.targetId,
              skillId: event.skillId,
            },
            duration: MAX_DURATION,
          },
          state,
        ),
      ];
    case 'skill_used':
      return [
        makeEvent(
          {
            type: 'skill',
            icon: BattleAssets.icons.skill,
            title: 'Skill',
            description: `${combatantName(state, event.sourceId)} used ${event.skillId}`,
            color: 'mana',
            priority: 2,
            payload: {
              sourceId: event.sourceId,
              skillId: event.skillId,
              targetIds: event.targetIds,
            },
            duration: MAX_DURATION,
          },
          state,
        ),
      ];
    case 'status_applied':
      return [
        makeEvent(
          {
            type: 'status',
            icon: BattleAssets.icons.skill,
            title: 'Status',
            description: `${event.statusId} applied (${event.stacks} stacks)`,
            color: 'warning',
            priority: 1,
            payload: {
              targetId: event.targetId,
              statusId: event.statusId,
              stacks: event.stacks,
            },
          },
          state,
        ),
      ];
    case 'status_removed':
    case 'status_tick':
      return [];
    case 'combatant_killed':
      return [
        makeEvent(
          {
            type: 'death',
            icon: BattleAssets.icons.death,
            title: 'Defeated',
            description: `${combatantName(state, event.combatantId)} defeated`,
            color: 'error',
            priority: 4,
            payload: { combatantId: event.combatantId, killerId: event.killerId },
            duration: MAX_DURATION,
          },
          state,
        ),
      ];
    case 'turn_started': {
      const team = state?.combatants.get(event.combatantId)?.team;
      const label = team === 'player' ? 'Your Turn' : 'Enemy Turn';
      return [
        makeEvent(
          {
            type: 'turn',
            icon: BattleAssets.icons.turn,
            title: label,
            description: `${combatantName(state, event.combatantId)}'s turn`,
            color: 'primary',
            priority: 2,
            payload: { combatantId: event.combatantId, team },
            duration: MAX_DURATION,
          },
          state,
        ),
      ];
    }
    case 'turn_ended':
      return [
        makeEvent(
          {
            type: 'turn_end',
            icon: BattleAssets.icons.endTurn,
            title: 'Turn Ended',
            description: `${combatantName(state, event.combatantId)} ended turn`,
            color: 'textMuted',
            priority: 0,
            payload: { combatantId: event.combatantId },
          },
          state,
        ),
      ];
    case 'battle_won': {
      const label = event.team === 'player' ? 'Victory' : 'Defeat';
      return [
        makeEvent(
          {
            type: 'battle_end',
            icon: event.team === 'player' ? BattleAssets.icons.victory : BattleAssets.icons.defeat,
            title: label,
            description: label,
            color: event.team === 'player' ? 'gold' : 'error',
            priority: 5,
            payload: { team: event.team },
            duration: MAX_DURATION,
          },
          state,
        ),
      ];
    }
    default:
      return [];
  }
}

export function mapBattleEventsToUIEvents(
  events: readonly BattleEvent[],
  state: BattleState | null,
): BattleUIEvent[] {
  return events.flatMap((e) => mapSingleEvent(e, state));
}

export function createSystemUIEvent(
  title: string,
  description: string,
  type = 'system',
  round = 1,
): BattleUIEvent {
  return makeEvent(
    {
      type,
      icon: BattleAssets.icons.debug,
      title,
      description,
      color: 'textMuted',
      priority: 0,
      payload: {},
    },
    null,
    round,
  );
}

export function createErrorUIEvent(code: string, round = 1): BattleUIEvent {
  return makeEvent(
    {
      type: 'error',
      icon: BattleAssets.icons.error,
      title: 'Error',
      description: `Error: ${code}`,
      color: 'error',
      priority: 5,
      payload: { code },
    },
    null,
    round,
  );
}
