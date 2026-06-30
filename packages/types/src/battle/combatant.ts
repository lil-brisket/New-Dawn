import type { HexCoord } from './grid';
import type { Team } from './team';

export interface Combatant {
  readonly id: string;
  readonly name: string;
  readonly team: Team;
  readonly position: HexCoord;
  readonly hp: number;
  readonly maxHp: number;
  readonly sp: number;
  readonly maxSp: number;
  readonly attack: number;
  readonly defense: number;
  readonly movement: number;
  readonly ap: number;
  readonly maxAp: number;
}
