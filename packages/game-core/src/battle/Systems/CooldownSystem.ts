import type { BattleState } from '@dawn/types';

/** Decrements skill cooldowns each turn. */
export class CooldownSystem {
  readonly name = 'CooldownSystem';

  tickTurn(state: BattleState): void {
    for (const entity of Object.values(state.entities)) {
      if (!entity.isAlive) continue;
      for (const skillId of Object.keys(entity.cooldowns)) {
        const current = entity.cooldowns[skillId] ?? 0;
        if (current > 0) {
          entity.cooldowns[skillId] = current - 1;
        }
      }
    }
  }
}
