import type { Theme } from '@dawn/ui';
import type { HexCoord } from '@dawn/types';
import { BattleAssets } from '../assets/BattleAssets';
import { tileVariant } from '../utils/tileVariation';

function variantFill(theme: Theme, variant: 0 | 1 | 2): string {
  const { tile } = theme.game.battle;
  switch (variant) {
    case 0:
      return tile.variant0;
    case 1:
      return tile.variant1;
    case 2:
      return tile.variant2;
  }
}

export function getTerrainFill(
  theme: Theme,
  coord: HexCoord,
  terrainId: string | undefined,
  walkable: boolean,
): string {
  const { tile } = theme.game.battle;
  if (!walkable) return tile.blocked;

  switch (terrainId) {
    case BattleAssets.terrain.grass:
      return theme.colors.primary + '22';
    case BattleAssets.terrain.water:
      return theme.colors.mana + '33';
    case BattleAssets.terrain.lava:
      return theme.colors.error + '33';
    case BattleAssets.terrain.wall:
    case BattleAssets.terrain.obstacle:
      return tile.blocked;
    case BattleAssets.terrain.cover:
      return theme.colors.warning + '22';
    default:
      return variantFill(theme, tileVariant(coord));
  }
}

export function getTileHighlightFill(theme: Theme, highlight: string): string | undefined {
  const { tile } = theme.game.battle;
  switch (highlight) {
    case 'hover':
      return tile.hover;
    case 'reachable':
    case 'path_step':
      return tile.move;
    case 'path':
      return tile.movePath;
    case 'attackable':
    case 'attack_range':
      return tile.attack;
    case 'occupied':
      return theme.colors.surfaceElevated;
    case 'blocked':
      return tile.blocked;
    default:
      return undefined;
  }
}

export function getTileStroke(
  theme: Theme,
  highlight: string,
  showGrid: boolean,
  gridStrong: boolean,
): { stroke: string; strokeWidth: number } {
  const { tile } = theme.game.battle;
  const { colors, border } = theme;

  if (highlight === 'hover') {
    return { stroke: colors.borderStrong, strokeWidth: 1.5 };
  }
  if (highlight === 'reachable' || highlight === 'path_step') {
    return { stroke: tile.borderSubtle, strokeWidth: 1 };
  }
  if (highlight === 'path') {
    return { stroke: colors.success, strokeWidth: 2 };
  }
  if (highlight === 'attackable' || highlight === 'attack_range') {
    return { stroke: colors.success, strokeWidth: 2 };
  }
  if (showGrid) {
    return {
      stroke: gridStrong ? tile.border : 'transparent',
      strokeWidth: gridStrong ? border.normal : border.thin,
    };
  }
  return { stroke: 'transparent', strokeWidth: border.thin };
}

export function getTileHighlightOpacity(_theme: Theme, highlight: string): number {
  switch (highlight) {
    case 'reachable':
    case 'path_step':
      return 0.55;
    case 'path':
      return 0.82;
    case 'attackable':
    case 'attack_range':
      return 0.8;
    case 'hover':
      return 0.7;
    default:
      return 1;
  }
}

export function getSelectedRingStroke(theme: Theme): { stroke: string; strokeWidth: number } {
  return { stroke: theme.colors.primary, strokeWidth: 3 };
}
