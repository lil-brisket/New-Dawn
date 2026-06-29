import type { BattleCommand, BattleState } from '@dawn/types';
import type { System, SystemContext } from './System';

export class TurnSystem implements System {
  readonly name = 'TurnSystem';

  canHandle(command: BattleCommand): boolean {
    return command.type === 'end_turn';
  }

  execute(state: BattleState, command: BattleCommand, ctx: SystemContext): void {
    if (command.type !== 'end_turn') return;

    const { turn } = state;
    const currentId = turn.currentEntityId;

    if (currentId) {
      ctx.eventBus.emit({ type: 'turn_ended', entityId: currentId });
      ctx.battleLog.append({
        actorId: currentId,
        targetIds: [],
        command,
      });
    }

    const nextIndex = (turn.turnIndex + 1) % turn.initiativeOrder.length;
    const nextEntityId = turn.initiativeOrder[nextIndex] ?? null;

    turn.turnIndex = nextIndex;
    if (nextIndex === 0) {
      turn.round += 1;
    }
    turn.currentEntityId = nextEntityId;

    if (nextEntityId) {
      ctx.eventBus.emit({ type: 'turn_started', entityId: nextEntityId, round: turn.round });
    }
  }
}
