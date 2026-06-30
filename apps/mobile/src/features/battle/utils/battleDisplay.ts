import type { Combatant, BattleState, Team } from '@dawn/types';
import { getActiveCombatant, isCombatantAlive } from '@dawn/game-core';

export interface StatusDisplayItem {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly remainingTurns: number;
}

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
  readonly statusEffects: readonly StatusDisplayItem[];
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

export function combatantToDisplay(
  combatant: Combatant,
  statusEffects: StatusDisplayItem[] = [],
): CombatantDisplay {
  const extended = combatant as Combatant & { level?: number };
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
    statusEffects,
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
    representative: rep ? combatantToDisplay(rep) : null,
    rosterCount: alive.length,
  };
}

export interface TurnDisplay {
  readonly round: number;
  readonly turn: number;
  readonly areaName: string;
  readonly phaseLabel: string;
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

  return {
    round: state.round,
    turn: state.turn + 1,
    areaName,
    phaseLabel,
  };
}
