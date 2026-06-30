import type { BattleAction, BattleState } from '@dawn/types';

export interface AIStrategy {
  readonly id: string;
  readonly name: string;
  planTurn(state: BattleState): readonly BattleAction[];
}
