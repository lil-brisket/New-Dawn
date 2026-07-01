import type { HexCoord } from './grid';
import type { Team } from './team';
import type { StatusInstance } from '../status';

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
  readonly speed: number;
  readonly willpower: number;
  readonly resistance: number;
  readonly movement: number;
  readonly ap: number;
  readonly maxAp: number;
  readonly skillIds: readonly string[];
  readonly statuses: readonly StatusInstance[];
  readonly skillCooldowns: Readonly<Record<string, number>>;
  /** Bonus HP pool — damage is absorbed here before real HP. */
  readonly shieldHp?: number;
  readonly shieldTurns?: number;
}
