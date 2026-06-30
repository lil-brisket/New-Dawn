import type { Combatant, HexCoord, Team } from '@dawn/types';

export type { Combatant };

export interface CreateCombatantInput {
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

export function createCombatant(input: CreateCombatantInput): Combatant {
  return { ...input };
}

export function withHp(combatant: Combatant, hp: number): Combatant {
  return { ...combatant, hp: Math.max(0, hp) };
}

export function withPosition(combatant: Combatant, position: HexCoord): Combatant {
  return { ...combatant, position };
}

export function withAp(combatant: Combatant, ap: number): Combatant {
  return { ...combatant, ap: Math.max(0, ap) };
}
