import type { BattleCommand, BattleState } from '@dawn/types';
import { hexDistance, hexEquals } from '@dawn/utils';
import type { Result } from '@dawn/utils';

export function validateCommand(
  state: BattleState,
  command: BattleCommand,
): Result<BattleCommand, string> {
  const actor = state.entities[command.actorId];
  if (!actor) return { ok: false, error: 'Actor not found' };
  if (!actor.isAlive) return { ok: false, error: 'Actor is dead' };
  if (state.turn.currentEntityId !== command.actorId && command.type !== 'end_turn') {
    return { ok: false, error: 'Not actor turn' };
  }

  switch (command.type) {
    case 'move': {
      if (!state.entities[command.actorId]) return { ok: false, error: 'Invalid actor' };
      const dist = hexDistance(actor.position, command.targetPosition);
      if (dist > 3) return { ok: false, error: 'Target out of move range' };
      const occupied = Object.values(state.entities).some(
        (e) => e.isAlive && hexEquals(e.position, command.targetPosition) && e.id !== actor.id,
      );
      if (occupied) return { ok: false, error: 'Target cell occupied' };
      return { ok: true, value: command };
    }
    case 'attack': {
      const target = state.entities[command.targetId];
      if (!target || !target.isAlive) return { ok: false, error: 'Target not found' };
      if (target.faction === actor.faction) return { ok: false, error: 'Cannot attack ally' };
      const dist = hexDistance(actor.position, target.position);
      if (dist > 1) return { ok: false, error: 'Target out of attack range' };
      return { ok: true, value: command };
    }
    case 'skill':
    case 'item':
    case 'end_turn':
      return { ok: true, value: command };
    default:
      return { ok: false, error: 'Unknown command' };
  }
}
