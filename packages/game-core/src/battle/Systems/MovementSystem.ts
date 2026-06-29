import type { BattleCommand, BattleState } from '@dawn/types';
import type { System, SystemContext } from './System';

export class MovementSystem implements System {
  readonly name = 'MovementSystem';

  canHandle(command: BattleCommand): boolean {
    return command.type === 'move';
  }

  execute(state: BattleState, command: BattleCommand, ctx: SystemContext): void {
    if (command.type !== 'move') return;

    const actor = state.entities[command.actorId];
    if (!actor) return;

    const from = { ...actor.position };
    actor.position = { ...command.targetPosition };

    ctx.eventBus.emit({
      type: 'player_moved',
      entityId: actor.id,
      from,
      to: actor.position,
      animationKey: 'anim_move',
      soundKey: 'sfx_footstep',
    });

    ctx.battleLog.append({
      actorId: actor.id,
      targetIds: [],
      command,
      animationKey: 'anim_move',
      soundKey: 'sfx_footstep',
    });
  }
}
