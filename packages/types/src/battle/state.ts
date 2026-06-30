import type { BattleAction } from '../commands/battle';
import type { BattleConfig } from './config';
import type { Combatant } from './combatant';
import type { Grid } from './grid';
import type { Team } from './team';

export interface TurnActionState {
  readonly movesUsed: number;
  readonly hasUsedPrimaryAction: boolean;
  readonly apSpent: number;
}

export interface BattleState {
  readonly battleId: string;
  readonly round: number;
  readonly turn: number;
  readonly seed: number;
  readonly createdAt: number;
  readonly playerId: string;
  readonly activeCombatantId: string | null;
  readonly combatants: ReadonlyMap<string, Combatant>;
  readonly grid: Grid;
  readonly config: BattleConfig;
  readonly turnOrder: readonly string[];
  readonly turnActionState: TurnActionState;
  readonly winner: Team | null;
  readonly history: readonly BattleAction[];
}
