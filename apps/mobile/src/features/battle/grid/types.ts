import type { HexCoord } from '@dawn/types';
import type { FloatingTextItem } from '../state/BattleUIState';
import type { GridAxisConfig } from '../theme/battlePlatformLayout';
import type { TileHighlight } from './HexTile';

export type { TileHighlight };

export interface TileRenderData {
  coord: HexCoord;
  cx: number;
  cy: number;
  highlight: TileHighlight;
  walkable: boolean;
  terrainId?: string;
  apLabel?: string;
  combatantId?: string;
}

export interface GridLayerProps {
  tiles: TileRenderData[];
  hexSize: number;
  gridPadding: number;
  svgWidth: number;
  svgHeight: number;
  reserveAxisLabels: boolean;
  gridAxis: GridAxisConfig;
}

export interface UnitRenderData {
  combatantId: string;
  team: 'player' | 'enemy';
  label: string;
  cx: number;
  cy: number;
  isActive: boolean;
  isSelected: boolean;
  isAttackableTarget?: boolean;
}

export interface BattleGridLayers {
  terrain: GridLayerProps & { showGrid: boolean };
  grid: GridLayerProps & { showGrid: boolean };
  movement: GridLayerProps & { pathCoords: HexCoord[] };
  attack: GridLayerProps;
  units: {
    units: UnitRenderData[];
    hexSize: number;
  };
  effects: GridLayerProps;
  floatingTexts: {
    items: FloatingTextItem[];
    hexSize: number;
  };
  selection: GridLayerProps & {
    hoverTile: HexCoord | null;
    selectedTile: HexCoord | null;
  };
  coordinates: GridLayerProps & {
    showAxisLabels: boolean;
    showTileCoords: boolean;
    gridWidth: number;
    gridHeight: number;
  };
  input: GridLayerProps & {
    targetingMode: 'idle' | 'move' | 'attack' | 'skill';
    attackableCoordKeys: Set<string>;
    reachableCoordKeys: Set<string>;
    onTilePress: (coord: HexCoord) => void;
    onInvalidAttackTarget: (coord: HexCoord) => void;
    onTileHover: (coord: HexCoord | null, unitId?: string | null) => void;
    onUnitPress: (combatantId: string) => void;
    onUnitLongPress: (combatantId: string) => void;
    combatantAt: Map<string, string>;
  };
}

export interface BattleGridProps {
  layers: BattleGridLayers;
  camera: { hexSize: number };
  activeCombatantPosition?: HexCoord | null;
  onLayout?: (width: number, height: number) => void;
}
