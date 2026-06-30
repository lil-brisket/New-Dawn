import type { BattleEvent, BattleState, Team } from '@dawn/types';
import { isCombatantAlive } from '../../queries/isCombatantAlive';

export function checkVictory(state: BattleState): Team | null {
  const players = [...state.combatants.values()].filter((c) => c.team === 'player');
  const enemies = [...state.combatants.values()].filter((c) => c.team === 'enemy');

  const anyPlayerAlive = players.some(isCombatantAlive);
  const anyEnemyAlive = enemies.some(isCombatantAlive);

  if (!anyEnemyAlive && players.length > 0) return 'player';
  if (!anyPlayerAlive && enemies.length > 0) return 'enemy';
  return null;
}

export function applyVictory(
  state: BattleState,
  winner: Team,
): {
  state: BattleState;
  events: readonly BattleEvent[];
} {
  return {
    state: { ...state, winner },
    events: [{ type: 'battle_won', team: winner }],
  };
}
