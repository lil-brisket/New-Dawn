import type { BattleState } from '@dawn/types';
import type { SystemContext } from './System';

export class VictorySystem {
  readonly name = 'VictorySystem';

  checkOutcome(state: BattleState, ctx: SystemContext): void {
    const players = Object.values(state.entities).filter((e) => e.faction === 'player');
    const enemies = Object.values(state.entities).filter((e) => e.faction === 'enemy');

    const playersAlive = players.some((e) => e.isAlive);
    const enemiesAlive = enemies.some((e) => e.isAlive);

    if (!playersAlive) {
      state.outcome = 'defeat';
      state.phase = 'defeat';
      ctx.eventBus.emit({ type: 'battle_defeat' });
      return;
    }

    if (!enemiesAlive) {
      state.outcome = 'victory';
      state.phase = 'victory';
      ctx.eventBus.emit({ type: 'battle_victory' });
    }
  }
}
