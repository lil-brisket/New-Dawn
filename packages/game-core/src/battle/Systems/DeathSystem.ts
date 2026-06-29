import type { BattleState } from '@dawn/types';
import type { SystemContext } from './System';

export class DeathSystem {
  readonly name = 'DeathSystem';

  checkDeaths(state: BattleState, ctx: SystemContext): void {
    for (const entity of Object.values(state.entities)) {
      if (entity.stats.hp <= 0 && entity.isAlive) {
        entity.isAlive = false;
        ctx.eventBus.emit({
          type: 'enemy_died',
          entityId: entity.id,
          animationKey: 'anim_death',
          soundKey: 'sfx_death',
        });
      }
    }
  }
}
