import { Polygon, Text as SvgText, Line, Rect } from 'react-native-svg';
import type { HexCoord } from '@dawn/types';
import { useTheme } from '@dawn/ui';
import { hexPoints, formatCoord, cubeToPixel, type GridLayoutOptions } from '../utils/hexLayout';
import {
  getTerrainFill,
  getTileHighlightFill,
  getTileHighlightOpacity,
  getTileStroke,
  getSelectedRingStroke,
} from './terrainStyles';

export type TileHighlight =
  | 'none'
  | 'selected'
  | 'path'
  | 'path_step'
  | 'reachable'
  | 'attack_range'
  | 'attackable'
  | 'occupied'
  | 'blocked'
  | 'hover';

export interface HexTileProps {
  coord: HexCoord;
  cx: number;
  cy: number;
  hexSize: number;
  highlight: TileHighlight;
  walkable: boolean;
  terrainId?: string;
  showCoords?: boolean;
  showGrid?: boolean;
  gridStrong?: boolean;
  apLabel?: string;
  fillOverride?: string;
}

export function HexTile({
  coord,
  cx,
  cy,
  hexSize,
  highlight,
  walkable,
  terrainId,
  showCoords = false,
  showGrid = false,
  gridStrong = false,
  apLabel,
  fillOverride,
}: HexTileProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const baseFill = fillOverride ?? getTerrainFill(theme, coord, terrainId, walkable);
  const isSelectedUnit = highlight === 'selected';
  const highlightFill = isSelectedUnit ? undefined : getTileHighlightFill(theme, highlight);
  const highlightOpacity = highlightFill ? getTileHighlightOpacity(theme, highlight) : 1;

  const { stroke, strokeWidth } = getTileStroke(theme, highlight, showGrid, gridStrong);
  const selectedRing = isSelectedUnit ? getSelectedRingStroke(theme) : null;

  let strokeDasharray: string | undefined;
  if (highlight === 'reachable' || highlight === 'path_step') strokeDasharray = '4,3';
  if (highlight === 'path') strokeDasharray = '5,3';
  if (highlight === 'attack_range') strokeDasharray = '3,3';

  const points = hexPoints(cx, cy, hexSize);
  const fontSize = Math.max(7, hexSize * 0.28);
  const bleedEdges = !highlightFill && !isSelectedUnit && !showGrid;

  return (
    <>
      <Polygon
        points={points}
        fill={baseFill}
        stroke={bleedEdges ? baseFill : 'transparent'}
        strokeWidth={bleedEdges ? 1 : 0}
      />
      {highlightFill ? (
        <Polygon
          points={points}
          fill={highlightFill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          opacity={highlightOpacity}
        />
      ) : null}
      {selectedRing ? (
        <Polygon
          points={points}
          fill="transparent"
          stroke={selectedRing.stroke}
          strokeWidth={selectedRing.strokeWidth}
        />
      ) : null}
      {highlight === 'attackable' ? (
        <Polygon
          points={points}
          fill="transparent"
          stroke={colors.error}
          strokeWidth={3}
          opacity={1}
        />
      ) : null}
      {showCoords && (
        <SvgText
          x={cx}
          y={cy - (apLabel ? 4 : 0)}
          fontSize={fontSize}
          fill={theme.game.battle.tile.label}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {formatCoord(coord)}
        </SvgText>
      )}
      {apLabel && (
        <SvgText
          x={cx}
          y={cy + hexSize * 0.35}
          fontSize={fontSize}
          fill={colors.success}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight="bold"
        >
          {apLabel}
        </SvgText>
      )}
    </>
  );
}

export function PathPreviewLine({
  path,
  hexSize,
  gridPadding,
  layoutOptions,
}: {
  path: HexCoord[];
  hexSize: number;
  gridPadding: number;
  layoutOptions?: GridLayoutOptions;
}) {
  const { theme } = useTheme();
  const { colors, border } = theme;
  if (path.length < 2) return null;

  const points = path.map((c) => {
    const { cx, cy } = cubeToPixel(c, hexSize, gridPadding, layoutOptions);
    return { cx, cy };
  });

  return (
    <>
      {points.slice(1).map((p, i) => {
        const prev = points[i]!;
        return (
          <Line
            key={`path-${i}`}
            x1={prev.cx}
            y1={prev.cy}
            x2={p.cx}
            y2={p.cy}
            stroke={colors.success}
            strokeWidth={border.normal}
            strokeDasharray="4,4"
            opacity={0.8}
          />
        );
      })}
    </>
  );
}

export function AxisLabel({
  label,
  x,
  y,
  hexSize,
}: {
  label: string;
  x: number;
  y: number;
  hexSize: number;
}) {
  const { theme } = useTheme();
  const { colors } = theme;
  const fontSize = Math.max(10, hexSize * 0.34);
  const paddingH = 5;
  const paddingV = 3;
  const charWidth = fontSize * 0.58;
  const labelWidth = label.length * charWidth + paddingH * 2;
  const labelHeight = fontSize + paddingV * 2;
  const rectX = x - labelWidth / 2;
  const rectY = y - labelHeight / 2;

  return (
    <>
      <Rect
        x={rectX}
        y={rectY}
        width={labelWidth}
        height={labelHeight}
        rx={4}
        fill={colors.surfaceElevated}
        stroke={colors.border}
        strokeWidth={1}
        opacity={0.95}
      />
      <SvgText
        x={x}
        y={y + fontSize * 0.35}
        fontSize={fontSize}
        fill={colors.text}
        textAnchor="middle"
        fontWeight="bold"
      >
        {label}
      </SvgText>
    </>
  );
}
