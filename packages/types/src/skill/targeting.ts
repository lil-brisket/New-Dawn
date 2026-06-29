import type { HexCoord } from '../battle/grid';

export interface SingleEnemyTarget {
  type: 'single_enemy';
  range: number;
}

export interface SingleAllyTarget {
  type: 'single_ally';
  range: number;
}

export interface AreaTarget {
  type: 'area';
  range: number;
  radius: number;
}

export interface SelfTarget {
  type: 'self';
}

export interface TileTarget {
  type: 'tile';
  range: number;
}

export type TargetSelector =
  SingleEnemyTarget | SingleAllyTarget | AreaTarget | SelfTarget | TileTarget;

export interface TargetSelection {
  targetIds: string[];
  targetPosition?: HexCoord;
}
