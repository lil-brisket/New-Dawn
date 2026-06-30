import { View, Pressable, StyleSheet } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';
import type { HexCoord } from '@dawn/types';
import { hexEquals } from '@dawn/utils';
import type { GridAxisConfig } from '../theme/battlePlatformLayout';
import { useTheme } from '@dawn/ui';
import type { BattleGridLayers } from './types';
import { HexTile, PathPreviewLine, AxisLabel } from './HexTile';
import { UnitSprite } from './UnitSprite';
import { getTerrainFill } from './terrainStyles';
import { GridViewport } from './GridViewport';
import { columnLabelPosition, rowLabelPosition, formatCoord } from '../utils/hexLayout';

function coordKey(c: HexCoord): string {
  return `${c.x},${c.y},${c.z}`;
}

function TerrainLayer({
  tiles,
  hexSize,
}: {
  tiles: BattleGridLayers['terrain']['tiles'];
  hexSize: number;
}) {
  const { theme } = useTheme();
  return (
    <>
      {tiles.map((t) => (
        <HexTile
          key={`terrain-${coordKey(t.coord)}`}
          coord={t.coord}
          cx={t.cx}
          cy={t.cy}
          hexSize={hexSize}
          highlight="none"
          walkable={t.walkable}
          terrainId={t.terrainId}
          fillOverride={getTerrainFill(theme, t.coord, t.terrainId, t.walkable)}
        />
      ))}
    </>
  );
}

function GridRenderer({
  tiles,
  hexSize,
  showGrid,
  gridStrong,
}: {
  tiles: BattleGridLayers['grid']['tiles'];
  hexSize: number;
  showGrid: boolean;
  gridStrong: boolean;
}) {
  return (
    <>
      {tiles.map((t) => (
        <HexTile
          key={`grid-${coordKey(t.coord)}`}
          coord={t.coord}
          cx={t.cx}
          cy={t.cy}
          hexSize={hexSize}
          highlight={t.highlight === 'blocked' ? 'blocked' : 'none'}
          walkable={t.walkable}
          showGrid={showGrid}
          gridStrong={gridStrong}
        />
      ))}
    </>
  );
}

function MovementLayer({
  tiles,
  hexSize,
  pathCoords,
  showCoords,
  gridPadding,
  reserveAxisLabels,
  gridAxis,
}: {
  tiles: BattleGridLayers['movement']['tiles'];
  hexSize: number;
  pathCoords: HexCoord[];
  showCoords: boolean;
  gridPadding: number;
  reserveAxisLabels: boolean;
  gridAxis: GridAxisConfig;
}) {
  const pathSet = new Set(pathCoords.map(coordKey));
  const layoutOptions = { reserveAxisLabels, axis: gridAxis };
  return (
    <>
      <PathPreviewLine
        path={pathCoords}
        hexSize={hexSize}
        gridPadding={gridPadding}
        layoutOptions={layoutOptions}
      />
      {tiles
        .filter(
          (t) => (t.highlight === 'reachable' || pathSet.has(coordKey(t.coord))) && !t.combatantId,
        )
        .map((t) => {
          const key = coordKey(t.coord);
          const highlight = pathSet.has(key) ? 'path' : 'reachable';
          return (
            <HexTile
              key={`move-${key}`}
              coord={t.coord}
              cx={t.cx}
              cy={t.cy}
              hexSize={hexSize}
              highlight={highlight}
              walkable={t.walkable}
              apLabel={t.apLabel}
              showCoords={showCoords}
            />
          );
        })}
    </>
  );
}

function AttackLayer({
  tiles,
  hexSize,
}: {
  tiles: BattleGridLayers['attack']['tiles'];
  hexSize: number;
}) {
  return (
    <>
      {tiles
        .filter((t) => t.highlight === 'attack_range' || t.highlight === 'attackable')
        .map((t) => (
          <HexTile
            key={`atk-${coordKey(t.coord)}`}
            coord={t.coord}
            cx={t.cx}
            cy={t.cy}
            hexSize={hexSize}
            highlight={t.highlight === 'attackable' ? 'attackable' : 'attack_range'}
            walkable={t.walkable}
          />
        ))}
    </>
  );
}

function UnitLayer({ units, hexSize }: BattleGridLayers['units']) {
  return (
    <>
      {units.map((u) => (
        <UnitSprite
          key={u.combatantId}
          label={u.label}
          team={u.team}
          cx={u.cx}
          cy={u.cy}
          hexSize={hexSize}
          isActive={u.isActive}
          isSelected={u.isSelected}
          isAttackableTarget={u.isAttackableTarget}
        />
      ))}
    </>
  );
}

function EffectsLayer() {
  return null;
}

function FloatingTextLayer({ items }: BattleGridLayers['floatingTexts']) {
  const { theme } = useTheme();
  return (
    <>
      {items.map((item) => {
        const color = theme.colors[item.color as keyof typeof theme.colors] ?? item.color;
        return (
          <SvgText
            key={item.id}
            x={item.cx}
            y={item.cy - 20}
            fill={color as string}
            fontSize={theme.game.battle.floatingCombatTextSize}
            fontWeight="bold"
            textAnchor="middle"
          >
            {item.text}
          </SvgText>
        );
      })}
    </>
  );
}

function SelectionLayer({
  tiles,
  hexSize,
  hoverTile,
  selectedTile,
  pathCoords,
}: {
  tiles: BattleGridLayers['selection']['tiles'];
  hexSize: number;
  hoverTile: HexCoord | null;
  selectedTile: HexCoord | null;
  pathCoords: HexCoord[];
}) {
  const pathSet = new Set(pathCoords.map(coordKey));

  return (
    <>
      {tiles.map((t) => {
        const key = coordKey(t.coord);
        if (pathSet.has(key)) return null;
        const isHover = hoverTile && hexEquals(t.coord, hoverTile);
        const isSelected =
          t.highlight === 'selected' || (selectedTile && hexEquals(t.coord, selectedTile));
        if (!isHover && !isSelected) return null;
        if (t.combatantId) return null;
        return (
          <HexTile
            key={`sel-${coordKey(t.coord)}`}
            coord={t.coord}
            cx={t.cx}
            cy={t.cy}
            hexSize={hexSize}
            highlight={isSelected ? 'selected' : 'hover'}
            walkable={t.walkable}
          />
        );
      })}
    </>
  );
}

function TileCoordsLayer({
  tiles,
  hexSize,
  showTileCoords,
}: {
  tiles: BattleGridLayers['coordinates']['tiles'];
  hexSize: number;
  showTileCoords: boolean;
}) {
  const { theme } = useTheme();
  if (!showTileCoords) return null;

  const fontSize = Math.max(7, hexSize * 0.28);

  return (
    <>
      {tiles.map((t) => (
        <SvgText
          key={`tile-coord-${coordKey(t.coord)}`}
          x={t.cx}
          y={t.cy}
          fontSize={fontSize}
          fill={theme.game.battle.tile.label}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {formatCoord(t.coord)}
        </SvgText>
      ))}
    </>
  );
}

function CoordinateLayer({
  gridWidth,
  gridHeight,
  hexSize,
  gridPadding,
  gridAxis,
  showAxisLabels,
}: {
  gridWidth: number;
  gridHeight: number;
  hexSize: number;
  gridPadding: number;
  gridAxis: GridAxisConfig;
  showAxisLabels: boolean;
}) {
  if (!showAxisLabels || gridWidth === 0 || gridHeight === 0) return null;

  const colLabels = Array.from({ length: gridWidth }, (_, col) => {
    const { x, y } = columnLabelPosition(col, hexSize, gridPadding, gridAxis);
    return { label: String(col + 1), x, y };
  });

  const rowLabels = Array.from({ length: gridHeight }, (_, row) => {
    const { x, y } = rowLabelPosition(row, hexSize, gridPadding, gridAxis);
    return { label: String.fromCharCode(65 + row), x, y };
  });

  return (
    <>
      {colLabels.map((l) => (
        <AxisLabel key={`col-${l.label}`} label={l.label} x={l.x} y={l.y} hexSize={hexSize} />
      ))}
      {rowLabels.map((l) => (
        <AxisLabel key={`row-${l.label}`} label={l.label} x={l.x} y={l.y} hexSize={hexSize} />
      ))}
    </>
  );
}

function GridInputLayer({
  tiles,
  hexSize,
  svgWidth,
  svgHeight,
  targetingMode,
  attackableCoordKeys,
  onTilePress,
  onInvalidAttackTarget,
  onTileHover,
  onUnitPress,
  onUnitLongPress,
  combatantAt,
}: BattleGridLayers['input']) {
  return (
    <View style={[StyleSheet.absoluteFill, { width: svgWidth, height: svgHeight }]}>
      {tiles.map((t) => {
        const unitId = combatantAt.get(coordKey(t.coord));
        const tileKey = coordKey(t.coord);
        const isAttackMode = targetingMode === 'attack';
        const isAttackableTarget = attackableCoordKeys.has(tileKey);

        const handleHover = (coord: HexCoord | null, hoveredUnitId?: string | null) => {
          if (isAttackMode && coord && !attackableCoordKeys.has(coordKey(coord))) {
            onTileHover(null, null);
            return;
          }
          onTileHover(coord, hoveredUnitId);
        };

        return (
          <Pressable
            key={`input-${tileKey}`}
            style={{
              position: 'absolute',
              left: t.cx - hexSize,
              top: t.cy - hexSize,
              width: hexSize * 2,
              height: hexSize * 2,
            }}
            onPress={() => {
              if (isAttackMode) {
                if (!isAttackableTarget) {
                  onInvalidAttackTarget(t.coord);
                  return;
                }
                onTilePress(t.coord);
              } else if (unitId) {
                onUnitPress(unitId);
              } else {
                onTilePress(t.coord);
              }
            }}
            onLongPress={() => {
              if (unitId) onUnitLongPress(unitId);
            }}
            onHoverIn={() => handleHover(t.coord, unitId ?? null)}
            onHoverOut={() => handleHover(null, null)}
            onPressIn={() => handleHover(t.coord, unitId ?? null)}
            onPressOut={() => handleHover(null, null)}
          />
        );
      })}
    </View>
  );
}

export interface BattleGridProps {
  layers: BattleGridLayers;
  gridPadding: number;
  gridStrong?: boolean;
  onViewportLayout?: (width: number, height: number) => void;
}

export function BattleGrid({
  layers,
  gridPadding,
  gridStrong = false,
  onViewportLayout,
}: BattleGridProps) {
  const { svgWidth, svgHeight, hexSize } = layers.grid;
  const showGrid = layers.grid.showGrid;
  const showCoords = layers.coordinates.showAxisLabels;

  return (
    <GridViewport svgWidth={svgWidth} svgHeight={svgHeight} onLayout={onViewportLayout}>
      <Svg width={svgWidth} height={svgHeight}>
        <TerrainLayer tiles={layers.terrain.tiles} hexSize={hexSize} />
        {gridStrong ? (
          <GridRenderer
            tiles={layers.grid.tiles}
            hexSize={hexSize}
            showGrid={showGrid}
            gridStrong={gridStrong}
          />
        ) : null}
        <MovementLayer
          tiles={layers.movement.tiles}
          hexSize={hexSize}
          pathCoords={layers.movement.pathCoords}
          showCoords={showCoords}
          gridPadding={gridPadding}
          reserveAxisLabels={layers.movement.reserveAxisLabels}
          gridAxis={layers.movement.gridAxis}
        />
        <AttackLayer tiles={layers.attack.tiles} hexSize={hexSize} />
        <SelectionLayer
          tiles={layers.selection.tiles}
          hexSize={hexSize}
          hoverTile={layers.selection.hoverTile}
          selectedTile={layers.selection.selectedTile}
          pathCoords={layers.movement.pathCoords}
        />
        <UnitLayer units={layers.units.units} hexSize={hexSize} />
        <EffectsLayer />
        <FloatingTextLayer items={layers.floatingTexts.items} hexSize={hexSize} />
        <CoordinateLayer
          gridWidth={layers.coordinates.gridWidth}
          gridHeight={layers.coordinates.gridHeight}
          hexSize={hexSize}
          gridPadding={gridPadding}
          gridAxis={layers.coordinates.gridAxis}
          showAxisLabels={layers.coordinates.showAxisLabels}
        />
        <TileCoordsLayer
          tiles={layers.coordinates.tiles}
          hexSize={hexSize}
          showTileCoords={layers.coordinates.showTileCoords}
        />
      </Svg>
      <GridInputLayer {...layers.input} hexSize={hexSize} />
    </GridViewport>
  );
}
