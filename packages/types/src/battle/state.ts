import type { BaseStats } from '../definitions';
import type { BattleOutcome, BattlePhase, Faction } from '../common';
import type { HexCell, HexCoord } from './grid';

export interface BattleEntity {
  id: string;
  definitionId: string;
  name: string;
  faction: Faction;
  position: HexCoord;
  stats: BaseStats;
  skillIds: string[];
  statusEffectIds: string[];
  isAlive: boolean;
}

export interface BattleUnit extends BattleEntity {
  turnOrder: number;
  cooldowns: Record<string, number>;
}

export interface TurnState {
  currentEntityId: string | null;
  round: number;
  turnIndex: number;
  initiativeOrder: string[];
}

export interface BattleState {
  id: string;
  phase: BattlePhase;
  outcome: BattleOutcome;
  gridWidth: number;
  gridHeight: number;
  entities: Record<string, BattleUnit>;
  turn: TurnState;
  cells: HexCell[];
}
