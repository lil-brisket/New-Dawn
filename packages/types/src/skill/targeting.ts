import type { HexCoord } from '../battle/grid';

export interface SingleEnemyTarget {
  type: 'single_enemy';
  range: number;
}

export interface SingleAllyTarget {
  type: 'single_ally';
  range: number;
}

export type AreaTeamFilter = 'enemy' | 'ally' | 'all';
export type AreaCenter = 'unit' | 'tile';

export interface AreaTarget {
  type: 'area';
  range: number;
  radius: number;
  filter: AreaTeamFilter;
  center: AreaCenter;
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
