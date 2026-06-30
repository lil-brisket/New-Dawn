import type { BattleAction, BattleState, HexCoord } from '@dawn/types';
import { hexDistance } from '@dawn/utils';
import { equals } from '../../grid/HexMath';
import { getActiveCombatant } from '../../queries/getActiveCombatant';
import { getAttackableTargets } from '../../queries/getAttackableTargets';
import { getReachableTiles } from '../../queries/getReachableTiles';
import { isCombatantAlive } from '../../queries/isCombatantAlive';
import type { AIStrategy } from '../types';
import { planStunnedSkip } from '../planStunnedSkip';

function findClosestPlayer(state: BattleState, from: HexCoord) {
  let closest: { id: string; position: HexCoord; dist: number } | null = null;

  for (const combatant of state.combatants.values()) {
    if (combatant.team !== 'player' || !isCombatantAlive(combatant)) continue;
    const dist = hexDistance(from, combatant.position);
    if (!closest || dist < closest.dist) {
      closest = { id: combatant.id, position: combatant.position, dist };
    } else if (closest && dist === closest.dist) {
      const tieBreak =
        combatant.position.x < closest.position.x ||
        (combatant.position.x === closest.position.x &&
          combatant.position.y < closest.position.y) ||
        (combatant.position.x === closest.position.x &&
          combatant.position.y === closest.position.y &&
          combatant.position.z < closest.position.z);
      if (tieBreak) {
        closest = { id: combatant.id, position: combatant.position, dist };
      }
    }
  }

  return closest;
}

function pickBestMoveTile(
  state: BattleState,
  combatantId: string,
  targetPosition: HexCoord,
): HexCoord | null {
  const reachable = getReachableTiles(state, combatantId);
  if (reachable.length === 0) return null;

  let best: HexCoord | null = null;
  let bestDist = Infinity;

  for (const tile of reachable) {
    const dist = hexDistance(tile, targetPosition);
    const isBetter =
      dist < bestDist ||
      (dist === bestDist &&
        best !== null &&
        (tile.x < best.x ||
          (tile.x === best.x && tile.y < best.y) ||
          (tile.x === best.x && tile.y === best.y && tile.z < best.z)));

    if (!best || isBetter) {
      best = tile;
      bestDist = dist;
    }
  }

  return best;
}

function compareCoords(a: HexCoord, b: HexCoord): number {
  if (a.x !== b.x) return a.x - b.x;
  if (a.y !== b.y) return a.y - b.y;
  return a.z - b.z;
}

export const nearestEnemyStrategy: AIStrategy = {
  id: 'nearest_enemy',
  name: 'Nearest Enemy',
  planTurn(state: BattleState): BattleAction[] {
    const stunnedSkip = planStunnedSkip(state);
    if (stunnedSkip) {
      return stunnedSkip;
    }

    const active = getActiveCombatant(state);
    if (!active || active.team !== 'enemy' || state.winner !== null) {
      return [];
    }

    const actions: BattleAction[] = [];
    const { config } = state;

    const attackTargets = getAttackableTargets(state, active.id);
    if (attackTargets.length > 0) {
      const target = attackTargets.sort((a, b) => compareCoords(a.position, b.position))[0]!;
      actions.push({ type: 'attack', combatantId: active.id, targetId: target.id });
    } else {
      const closest = findClosestPlayer(state, active.position);
      if (closest) {
        const destination = pickBestMoveTile(state, active.id, closest.position);
        if (destination && !equals(destination, active.position)) {
          actions.push({
            type: 'move',
            combatantId: active.id,
            destination,
          });
          if (hexDistance(destination, closest.position) <= config.attackRange) {
            actions.push({
              type: 'attack',
              combatantId: active.id,
              targetId: closest.id,
            });
          }
        }
      }
    }

    actions.push({ type: 'end_turn', combatantId: active.id });
    return actions;
  },
};
