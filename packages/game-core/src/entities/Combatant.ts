import type { Combatant, HexCoord, Team, TagInstance } from '@dawn/types';

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
  readonly speed?: number;
  readonly willpower?: number;
  readonly resistance?: number;
  readonly movement: number;
  readonly ap: number;
  readonly maxAp: number;
  readonly skillIds?: readonly string[];
  readonly tags?: readonly TagInstance[];
  readonly skillCooldowns?: Readonly<Record<string, number>>;
}

export function createCombatant(input: CreateCombatantInput): Combatant {
  return {
    ...input,
    speed: input.speed ?? 50,
    willpower: input.willpower ?? 10,
    resistance: input.resistance ?? 10,
    skillIds: input.skillIds ?? [],
    tags: input.tags ?? [],
    skillCooldowns: input.skillCooldowns ?? {},
  };
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

export function withSp(combatant: Combatant, sp: number): Combatant {
  return { ...combatant, sp: Math.max(0, Math.min(sp, combatant.maxSp)) };
}

export function withTags(combatant: Combatant, tags: readonly TagInstance[]): Combatant {
  return { ...combatant, tags };
}

/** @deprecated Use withTags */
export const withStatuses = withTags;

export function withCooldowns(
  combatant: Combatant,
  skillCooldowns: Readonly<Record<string, number>>,
): Combatant {
  return { ...combatant, skillCooldowns };
}

export function withCooldown(combatant: Combatant, skillId: string, turns: number): Combatant {
  return {
    ...combatant,
    skillCooldowns: { ...combatant.skillCooldowns, [skillId]: turns },
  };
}

export function withShield(combatant: Combatant, shieldHp: number, shieldTurns: number): Combatant {
  return {
    ...combatant,
    shieldHp: Math.max(0, shieldHp),
    shieldTurns: Math.max(0, Math.min(2, shieldTurns)),
  };
}

export function clearShield(combatant: Combatant): Combatant {
  return { ...combatant, shieldHp: 0, shieldTurns: 0 };
}
