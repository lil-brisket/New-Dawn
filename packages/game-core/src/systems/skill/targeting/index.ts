import type {
  BattleState,
  Combatant,
  HexCoord,
  SkillDefinition,
  TargetSelector,
} from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { distance } from '../../../grid/HexMath';
import { contains, getTile, spiral } from '../../../grid/GridOps';
import { getCombatant } from '../../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../../queries/isCombatantAlive';
import { isTileOccupied } from '../../../queries/getCombatantAt';
import { isAlly, isEnemy } from '../../../entities/Team';
import { getCombatantsInRadius, getTilesInRadius, matchesAreaFilter } from './area';
import { getSkillMovementRange, skillHasTeleport } from '../skillTagUtils';

export interface SkillTargetSelection {
  readonly targetId?: string;
  readonly destination?: HexCoord;
}

function getSource(state: BattleState, sourceId: string): Combatant | undefined {
  return getCombatant(state, sourceId);
}

function inRange(source: Combatant, coord: HexCoord, range: number): boolean {
  return distance(source.position, coord) <= range;
}

function inRangeOfUnit(source: Combatant, target: Combatant, range: number): boolean {
  return distance(source.position, target.position) <= range;
}

function isAreaTargeting(
  targeting: TargetSelector,
): targeting is Extract<TargetSelector, { type: 'area' }> {
  return targeting.type === 'area';
}

function resolveAreaCenter(
  state: BattleState,
  skill: SkillDefinition,
  sourceId: string,
  selection: SkillTargetSelection,
): HexCoord | null {
  const source = getSource(state, sourceId);
  if (!source || !isAreaTargeting(skill.targeting)) return null;

  const { targeting } = skill;

  if (targeting.center === 'tile' && selection.destination) {
    return selection.destination;
  }

  if (selection.targetId) {
    const target = getCombatant(state, selection.targetId);
    if (target && isCombatantAlive(target)) {
      return target.position;
    }
  }

  if (targeting.center === 'tile' && selection.destination) {
    return selection.destination;
  }

  return null;
}

export function getAreaAffectedCombatants(
  state: BattleState,
  skill: SkillDefinition,
  sourceId: string,
  selection: SkillTargetSelection,
): Combatant[] {
  const source = getSource(state, sourceId);
  if (!source || !isAreaTargeting(skill.targeting)) return [];

  const center = resolveAreaCenter(state, skill, sourceId, selection);
  if (!center) return [];

  return getCombatantsInRadius(
    state,
    center,
    skill.targeting.radius,
    skill.targeting.filter,
    source.team,
  );
}

export function getValidTargets(
  state: BattleState,
  skill: SkillDefinition,
  sourceId: string,
): string[] {
  const source = getSource(state, sourceId);
  if (!source) return [];

  const targeting = skill.targeting;
  const ids: string[] = [];

  if (isAreaTargeting(targeting)) {
    if (targeting.center === 'unit') {
      for (const combatant of state.combatants.values()) {
        if (!isCombatantAlive(combatant)) continue;
        if (!inRangeOfUnit(source, combatant, targeting.range)) continue;
        if (!matchesAreaFilter(source.team, combatant, targeting.filter)) continue;
        ids.push(combatant.id);
      }
    }
    return ids;
  }

  for (const combatant of state.combatants.values()) {
    if (!isCombatantAlive(combatant)) continue;

    switch (targeting.type) {
      case 'single_enemy':
        if (
          isEnemy(source.team, combatant.team) &&
          inRangeOfUnit(source, combatant, targeting.range)
        ) {
          ids.push(combatant.id);
        }
        break;
      case 'single_ally':
        if (
          isAlly(source.team, combatant.team) &&
          inRangeOfUnit(source, combatant, targeting.range)
        ) {
          ids.push(combatant.id);
        }
        break;
      case 'self':
        if (combatant.id === sourceId) {
          ids.push(combatant.id);
        }
        break;
      default:
        break;
    }
  }

  return ids;
}

export function getTargetTiles(
  state: BattleState,
  skill: SkillDefinition,
  sourceId: string,
): HexCoord[] {
  const source = getSource(state, sourceId);
  if (!source) return [];

  const targeting = skill.targeting;

  switch (targeting.type) {
    case 'tile': {
      const hasTeleport = skillHasTeleport(skill, defaultRegistry);
      const range = getSkillMovementRange(skill, defaultRegistry) ?? targeting.range;

      return spiral(state.grid, source.position, range).filter((coord) => {
        if (!inRange(source, coord, range)) return false;
        if (!contains(state.grid, coord)) return false;
        const tile = getTile(state.grid, coord);
        if (!tile?.walkable) return false;
        if (hasTeleport) {
          return !isTileOccupied(state, coord, sourceId);
        }
        return true;
      });
    }
    case 'area': {
      if (targeting.center === 'tile') {
        return spiral(state.grid, source.position, targeting.range).filter((coord) => {
          if (!inRange(source, coord, targeting.range)) return false;
          if (!contains(state.grid, coord)) return false;
          const tile = getTile(state.grid, coord);
          return tile?.walkable ?? false;
        });
      }
      const targets = getValidTargets(state, skill, sourceId);
      return targets
        .map((id) => getCombatant(state, id)?.position)
        .filter((p): p is HexCoord => p !== undefined);
    }
    case 'single_enemy':
    case 'single_ally': {
      const targets = getValidTargets(state, skill, sourceId);
      return targets
        .map((id) => getCombatant(state, id)?.position)
        .filter((p): p is HexCoord => p !== undefined);
    }
    case 'self':
      return [source.position];
    default:
      return [];
  }
}

export function getAffectedTiles(
  state: BattleState,
  skill: SkillDefinition,
  sourceId: string,
  selection: SkillTargetSelection,
): HexCoord[] {
  const source = getSource(state, sourceId);
  if (!source) return [];

  const targeting = skill.targeting;

  if (isAreaTargeting(targeting)) {
    const center = resolveAreaCenter(state, skill, sourceId, selection);
    if (!center) return [];
    return getTilesInRadius(state.grid, center, targeting.radius);
  }

  if (selection.destination) {
    return [selection.destination];
  }

  if (selection.targetId) {
    const target = getCombatant(state, selection.targetId);
    if (!target) return [];
    return [target.position];
  }

  if (targeting.type === 'self') {
    return [source.position];
  }

  return [];
}

export function canTarget(
  state: BattleState,
  skill: SkillDefinition,
  sourceId: string,
  selection: SkillTargetSelection,
): boolean {
  const source = getSource(state, sourceId);
  if (!source) return false;

  const targeting = skill.targeting;

  switch (targeting.type) {
    case 'self':
      return selection.targetId === sourceId || (!selection.targetId && !selection.destination);
    case 'single_enemy':
    case 'single_ally': {
      if (!selection.targetId) return false;
      return getValidTargets(state, skill, sourceId).includes(selection.targetId);
    }
    case 'tile': {
      if (!selection.destination) return false;
      const tiles = getTargetTiles(state, skill, sourceId);
      return tiles.some(
        (t) =>
          t.x === selection.destination!.x &&
          t.y === selection.destination!.y &&
          t.z === selection.destination!.z,
      );
    }
    case 'area': {
      if (targeting.center === 'tile') {
        if (!selection.destination) return false;
        const tiles = getTargetTiles(state, skill, sourceId);
        return tiles.some(
          (t) =>
            t.x === selection.destination!.x &&
            t.y === selection.destination!.y &&
            t.z === selection.destination!.z,
        );
      }
      if (!selection.targetId) return false;
      return getValidTargets(state, skill, sourceId).includes(selection.targetId);
    }
    default:
      return false;
  }
}

export function resolveSkillTargets(
  state: BattleState,
  skill: SkillDefinition,
  sourceId: string,
  selection: SkillTargetSelection,
): { targets: Combatant[]; targetTile?: HexCoord } {
  const source = getSource(state, sourceId);
  if (!source) return { targets: [] };

  const targeting = skill.targeting;

  if (targeting.type === 'self') {
    return { targets: [source] };
  }

  if (isAreaTargeting(targeting)) {
    const center = resolveAreaCenter(state, skill, sourceId, selection);
    if (!center) return { targets: [] };

    const targets = getCombatantsInRadius(
      state,
      center,
      targeting.radius,
      targeting.filter,
      source.team,
    );
    return { targets, targetTile: center };
  }

  if (selection.destination) {
    return { targets: [], targetTile: selection.destination };
  }

  if (selection.targetId) {
    const target = getCombatant(state, selection.targetId);
    if (!target || !isCombatantAlive(target)) {
      return { targets: [] };
    }
    return { targets: [target], targetTile: target.position };
  }

  return { targets: [] };
}

export function needsUnitTarget(selector: TargetSelector): boolean {
  return (
    selector.type === 'single_enemy' ||
    selector.type === 'single_ally' ||
    (selector.type === 'area' && selector.center === 'unit')
  );
}

export function needsTileTarget(skill: SkillDefinition): boolean {
  if (skill.targeting.type === 'tile') return true;
  return skill.targeting.type === 'area' && skill.targeting.center === 'tile';
}

export function isAreaSkill(skill: SkillDefinition): boolean {
  return skill.targeting.type === 'area';
}

export { preview } from '../simulateSkill';
