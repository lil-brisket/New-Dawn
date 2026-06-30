import type { BattleState, HexCoord } from '@dawn/types';
import { getAllCoords, getCombatantAt, type ReachableTileCost } from '@dawn/game-core';
import { hexEquals } from '@dawn/utils';
import { cubeToPixel, gridPixelSize } from '../utils/hexLayout';
import type { GridAxisConfig } from '../theme/battlePlatformLayout';
import type { TileHighlight } from './HexTile';
import type { TileRenderData, BattleGridLayers } from './types';
import type { BattleUIState } from '../state/BattleUIState';
import { getCombatantAvatarLabel } from '../utils/battleDisplay';

function coordKey(c: HexCoord): string {
  return `${c.x},${c.y},${c.z}`;
}

export function buildGridLayers(params: {
  state: BattleState;
  uiState: BattleUIState;
  hexSize: number;
  gridPadding: number;
  gridAxis: GridAxisConfig;
  reachableTileCosts: ReachableTileCost[];
  attackableUnitIds: Set<string>;
  attackableCoordKeys: Set<string>;
  attackRangeCoordKeys: Set<string>;
  reachableCoordKeys: Set<string>;
  selectedCombatantId: string | null;
  skillTargetCoordKeys?: Set<string>;
  aoePreviewCoordKeys?: Set<string>;
  targetingMode: 'idle' | 'move' | 'attack' | 'skill';
  showGrid: boolean;
  showAxisLabels: boolean;
  showCoords: boolean;
  onTilePress: (coord: HexCoord) => void;
  onTileHover: (coord: HexCoord | null, unitId?: string | null) => void;
  onInvalidAttackTarget: (coord: HexCoord) => void;
  onUnitPress: (combatantId: string) => void;
  onUnitLongPress: (combatantId: string) => void;
}): BattleGridLayers {
  const {
    state,
    uiState,
    hexSize,
    gridPadding,
    gridAxis,
    reachableTileCosts,
    attackableUnitIds,
    attackableCoordKeys,
    attackRangeCoordKeys,
    reachableCoordKeys,
    skillTargetCoordKeys = new Set<string>(),
    aoePreviewCoordKeys = new Set<string>(),
    selectedCombatantId,
    targetingMode,
    showGrid,
    showAxisLabels,
    showCoords,
    onTilePress,
    onTileHover,
    onInvalidAttackTarget,
    onUnitPress,
    onUnitLongPress,
  } = params;

  const reachableMap = new Map<string, ReachableTileCost>();
  for (const entry of reachableTileCosts) {
    reachableMap.set(coordKey(entry.coord), entry);
  }

  const attackCoords = new Set<string>();
  for (const c of state.combatants.values()) {
    if (attackableUnitIds.has(c.id)) {
      attackCoords.add(coordKey(c.position));
    }
  }

  const selectedUnit = selectedCombatantId ? state.combatants.get(selectedCombatantId) : undefined;

  const coords = getAllCoords(state.grid);
  const layoutOptions = { reserveAxisLabels: showAxisLabels, axis: gridAxis };
  const { svgWidth, svgHeight } = gridPixelSize(
    state.grid.width,
    state.grid.height,
    hexSize,
    gridPadding,
    layoutOptions,
  );

  const tiles: TileRenderData[] = coords.map((coord) => {
    const { cx, cy } = cubeToPixel(coord, hexSize, gridPadding, layoutOptions);
    const combatant = getCombatantAt(state, coord);
    const key = coordKey(coord);
    const reachable = reachableMap.get(key);
    const tile = state.grid.tiles.get(key);
    const isHover = uiState.hoverTile && hexEquals(coord, uiState.hoverTile);

    let highlight: TileHighlight = 'none';
    const isActingUnitTile =
      combatant != null &&
      (combatant.id === state.activeCombatantId ||
        (selectedUnit != null && hexEquals(coord, selectedUnit.position)));

    if (isActingUnitTile) {
      highlight = 'selected';
    } else if (isHover) {
      highlight = 'hover';
    } else if (attackCoords.has(key) || skillTargetCoordKeys.has(key)) {
      highlight = 'attackable';
    } else if (aoePreviewCoordKeys.has(key)) {
      highlight = 'attack_range';
    } else if (attackRangeCoordKeys.has(key)) {
      highlight = 'attack_range';
    } else if (reachable) {
      highlight = 'reachable';
    } else if (combatant) {
      highlight = 'occupied';
    } else if (tile && !tile.walkable) {
      highlight = 'blocked';
    }

    return {
      coord,
      cx,
      cy,
      highlight,
      walkable: tile?.walkable ?? false,
      terrainId: undefined,
      apLabel:
        reachable && showCoords ? `${reachable.apCost} AP` : reachable ? undefined : undefined,
      combatantId: combatant?.id,
    };
  });

  const combatantAt = new Map<string, string>();
  for (const t of tiles) {
    if (t.combatantId) combatantAt.set(coordKey(t.coord), t.combatantId);
  }

  const units = tiles
    .filter((t) => t.combatantId)
    .map((t) => {
      const c = state.combatants.get(t.combatantId!)!;
      return {
        combatantId: c.id,
        team: c.team,
        label: getCombatantAvatarLabel(c.name),
        cx: t.cx,
        cy: t.cy,
        isActive: state.activeCombatantId === c.id,
        isSelected: selectedCombatantId === c.id,
        isAttackableTarget: attackableUnitIds.has(c.id),
      };
    });

  const baseLayer = {
    tiles,
    hexSize,
    gridPadding,
    svgWidth,
    svgHeight,
    reserveAxisLabels: showAxisLabels,
    gridAxis,
  };

  return {
    terrain: { ...baseLayer, showGrid },
    grid: { ...baseLayer, showGrid },
    movement: { ...baseLayer, pathCoords: uiState.previewPath },
    attack: baseLayer,
    units: { units, hexSize },
    effects: baseLayer,
    floatingTexts: { items: uiState.floatingTexts, hexSize },
    selection: {
      ...baseLayer,
      hoverTile: uiState.hoverTile,
      selectedTile: uiState.selectedTile ?? selectedUnit?.position ?? null,
    },
    coordinates: {
      ...baseLayer,
      showAxisLabels,
      showTileCoords: showCoords,
      gridWidth: state.grid.width,
      gridHeight: state.grid.height,
    },
    input: {
      ...baseLayer,
      targetingMode,
      attackableCoordKeys,
      reachableCoordKeys,
      onTilePress,
      onTileHover,
      onInvalidAttackTarget,
      onUnitPress,
      onUnitLongPress,
      combatantAt,
    },
  };
}
