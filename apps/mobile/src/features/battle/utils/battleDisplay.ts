import type { BattleState, Combatant, Team } from '@dawn/types';
import {
  getActiveCombatant,
  isCombatantAlive,
  defaultRegistry,
  getTagDisplays,
} from '@dawn/game-core';
import { resolveTagIcon } from '../assets/resolveTagIcon';

export interface TagDisplayItem {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly remainingTurns: number;
  readonly stacks: number;
}

/** @deprecated Use TagDisplayItem */
export type StatusDisplayItem = TagDisplayItem;

export interface CombatantDisplay {
  readonly id: string;
  readonly name: string;
  readonly team: Team;
  readonly level: number;
  readonly hp: number;
  readonly maxHp: number;
  readonly sp: number;
  readonly maxSp: number;
  readonly portraitKey: string;
  readonly tagEffects: readonly TagDisplayItem[];
  readonly position: Combatant['position'];
}

export interface TeamDisplay {
  readonly id: Team;
  readonly label: string;
  readonly representative: CombatantDisplay | null;
  readonly rosterCount: number;
}

const TEAM_LABELS: Record<Team, string> = {
  player: 'TEAM A',
  enemy: 'TEAM B',
};

export function getCombatantAvatarLabel(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function combatantToDisplay(combatant: Combatant, state?: BattleState): CombatantDisplay {
  const extended = combatant as Combatant & { level?: number };
  const tagEffects: TagDisplayItem[] =
    state !== undefined
      ? getTagDisplays(state, combatant.id, defaultRegistry).map((s) => ({
          id: s.id,
          name: s.name,
          icon: resolveTagIcon(s.iconId),
          remainingTurns: s.remainingTurns,
          stacks: s.stacks,
        }))
      : [];

  return {
    id: combatant.id,
    name: combatant.name,
    team: combatant.team,
    level: extended.level ?? 1,
    hp: combatant.hp,
    maxHp: combatant.maxHp,
    sp: combatant.sp,
    maxSp: combatant.maxSp,
    portraitKey: combatant.team === 'player' ? 'knight' : 'goblin',
    tagEffects,
    position: combatant.position,
  };
}

export function getAliveCombatantsOnTeam(state: BattleState, team: Team): Combatant[] {
  const result: Combatant[] = [];
  for (const c of state.combatants.values()) {
    if (c.team === team && isCombatantAlive(c)) {
      result.push(c);
    }
  }
  return result;
}

export function getTeamRepresentative(state: BattleState, team: Team): Combatant | null {
  const active = getActiveCombatant(state);
  if (active && active.team === team && isCombatantAlive(active)) {
    return active;
  }
  const alive = getAliveCombatantsOnTeam(state, team);
  return alive[0] ?? null;
}

export function buildTeamDisplay(state: BattleState, team: Team): TeamDisplay {
  const alive = getAliveCombatantsOnTeam(state, team);
  const rep = getTeamRepresentative(state, team);
  return {
    id: team,
    label: TEAM_LABELS[team],
    representative: rep ? combatantToDisplay(rep, state) : null,
    rosterCount: alive.length,
  };
}

export interface TurnDisplay {
  readonly round: number;
  readonly turn: number;
  readonly areaName: string;
  readonly phaseLabel: string;
  readonly activeTeam: Team | null;
}

export function getGlobalTurnNumber(state: BattleState): number {
  return (state.round - 1) * state.turnOrder.length + state.turn + 1;
}

export function buildTurnDisplay(
  state: BattleState,
  areaName: string,
  playerTurn: boolean,
): TurnDisplay {
  const phaseLabel =
    state.winner === 'player'
      ? 'Victory'
      : state.winner === 'enemy'
        ? 'Defeat'
        : playerTurn
          ? 'Your Turn'
          : 'Enemy Turn';

  const active = getActiveCombatant(state);
  const activeTeam =
    state.winner !== null
      ? null
      : active?.team === 'player' || active?.team === 'enemy'
        ? active.team
        : null;

  return {
    round: state.round,
    turn: getGlobalTurnNumber(state),
    areaName,
    phaseLabel,
    activeTeam,
  };
}
