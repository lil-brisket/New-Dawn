import type { Team } from '@dawn/types';

export type { Team };

export function isAlly(teamA: Team, teamB: Team): boolean {
  return teamA === teamB;
}

export function isEnemy(teamA: Team, teamB: Team): boolean {
  return teamA !== teamB;
}

export function opposingTeam(team: Team): Team {
  return team === 'player' ? 'enemy' : 'player';
}
