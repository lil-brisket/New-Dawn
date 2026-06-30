import type { BattleConfig } from '@dawn/types';

export type { BattleConfig };

export function isValidConfig(config: BattleConfig): boolean {
  return (
    config.moveCost > 0 &&
    config.attackCost >= 0 &&
    config.maxMoves > 0 &&
    config.attackRange > 0 &&
    config.defaultMaxAp > 0
  );
}
