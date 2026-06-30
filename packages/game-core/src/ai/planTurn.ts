import type { BattleState, BattleAction } from '@dawn/types';
import type { AIStrategy } from './types';
import { nearestEnemyStrategy } from './strategies/nearestEnemy';
import { passiveStrategy } from './strategies/passive';
import { doNothingStrategy } from './strategies/doNothing';

const STRATEGIES: Record<string, AIStrategy> = {
  [nearestEnemyStrategy.id]: nearestEnemyStrategy,
  [passiveStrategy.id]: passiveStrategy,
  [doNothingStrategy.id]: doNothingStrategy,
};

export function getStrategy(id: string): AIStrategy {
  return STRATEGIES[id] ?? nearestEnemyStrategy;
}

export function planTurn(
  state: BattleState,
  strategy: AIStrategy | string,
): readonly BattleAction[] {
  const resolved = typeof strategy === 'string' ? getStrategy(strategy) : strategy;
  return resolved.planTurn(state);
}

export { nearestEnemyStrategy, passiveStrategy, doNothingStrategy };
