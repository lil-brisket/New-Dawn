import type { HexCoord } from '@dawn/types';
import { cubeToOffset } from '@dawn/game-core';
import type { GridAxisConfig } from '../theme/battlePlatformLayout';

/** Pointy-top odd-r layout; hexSize = circumradius (center to vertex). */

const DEFAULT_AXIS: GridAxisConfig = { marginRatio: 0.6, marginMin: 20 };

export interface GridLayoutOptions {
  /** Reserve margin bands for row/column labels outside the playfield */
  reserveAxisLabels?: boolean;
  axis?: GridAxisConfig;
}

/** Label badge dimensions — keep in sync with AxisLabel in HexTile.tsx */
export function axisLabelMetrics(hexSize: number): { width: number; height: number } {
  const fontSize = Math.max(10, hexSize * 0.34);
  const paddingH = 5;
  const paddingV = 3;
  const charWidth = fontSize * 0.58;
  return {
    width: charWidth + paddingH * 2,
    height: fontSize + paddingV * 2,
  };
}

/** Margin band wide/tall enough for axis label badges (centered in the band). */
export function axisMarginBand(hexSize: number, axis: GridAxisConfig = DEFAULT_AXIS): number {
  const { width, height } = axisLabelMetrics(hexSize);
  const ratioBand = Math.max(axis.marginMin, Math.round(hexSize * axis.marginRatio));
  return Math.max(ratioBand, Math.ceil(width) + 2, Math.ceil(height) + 2);
}

export function axisMargins(
  hexSize: number,
  axis: GridAxisConfig = DEFAULT_AXIS,
): {
  top: number;
  left: number;
} {
  const band = axisMarginBand(hexSize, axis);
  return { top: band, left: band };
}

function playfieldOrigin(
  hexSize: number,
  gridPadding: number,
  reserveAxisLabels: boolean,
  axis: GridAxisConfig,
) {
  const margins = reserveAxisLabels ? axisMargins(hexSize, axis) : { top: 0, left: 0 };
  return {
    x: margins.left + gridPadding,
    y: margins.top + gridPadding,
    axis: margins,
  };
}

export function hexPoints(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return points.join(' ');
}

export function cubeToPixel(
  coord: HexCoord,
  hexSize: number,
  gridPadding: number,
  options: GridLayoutOptions = {},
): { cx: number; cy: number } {
  const reserveAxisLabels = options.reserveAxisLabels !== false;
  const axis = options.axis ?? DEFAULT_AXIS;
  const { x: originX, y: originY } = playfieldOrigin(hexSize, gridPadding, reserveAxisLabels, axis);
  const { col, row } = cubeToOffset(coord);
  const sqrt3 = Math.sqrt(3);
  const cx = sqrt3 * hexSize * (col + 0.5 * (row & 1)) + hexSize + originX;
  const cy = 1.5 * hexSize * row + hexSize + originY;
  return { cx, cy };
}

/** Column number position — centered in the top margin above the playfield */
export function columnLabelPosition(
  col: number,
  hexSize: number,
  gridPadding: number,
  axis: GridAxisConfig = DEFAULT_AXIS,
): { x: number; y: number } {
  const { x: originX, axis: margins } = playfieldOrigin(hexSize, gridPadding, true, axis);
  const sqrt3 = Math.sqrt(3);
  const x = sqrt3 * hexSize * col + hexSize + originX;
  const y = margins.top / 2;
  return { x, y };
}

/** Row letter position — centered in the left margin beside the playfield */
export function rowLabelPosition(
  row: number,
  hexSize: number,
  gridPadding: number,
  axis: GridAxisConfig = DEFAULT_AXIS,
): { x: number; y: number } {
  const { y: originY, axis: margins } = playfieldOrigin(hexSize, gridPadding, true, axis);
  const x = margins.left / 2;
  const y = 1.5 * hexSize * row + hexSize + originY;
  return { x, y };
}

export function gridPixelSize(
  width: number,
  height: number,
  hexSize: number,
  gridPadding: number,
  options: GridLayoutOptions = {},
): { svgWidth: number; svgHeight: number } {
  const reserveAxisLabels = options.reserveAxisLabels !== false;
  const axis = options.axis ?? DEFAULT_AXIS;
  const margins = reserveAxisLabels ? axisMargins(hexSize, axis) : { top: 0, left: 0 };
  const sqrt3 = Math.sqrt(3);
  const playWidth = width <= 0 ? 0 : sqrt3 * hexSize * (width - 0.5) + 2 * hexSize;
  const playHeight = height <= 0 ? 0 : 1.5 * hexSize * Math.max(0, height - 1) + 2 * hexSize;
  return {
    svgWidth: margins.left + playWidth + gridPadding * 2,
    svgHeight: margins.top + playHeight + gridPadding * 2,
  };
}

/** Grid address matching axis labels — row letter + 1-based column (e.g. A1). */
export function formatGridAddress(coord: HexCoord): string {
  const { col, row } = cubeToOffset(coord);
  return `${String.fromCharCode(65 + row)}${col + 1}`;
}

export function formatCoord(coord: HexCoord): string {
  return formatGridAddress(coord);
}

/** Snap a touch point in grid SVG space to the nearest tile center. */
export function findNearestTileCoord(
  x: number,
  y: number,
  tiles: readonly { coord: HexCoord; cx: number; cy: number }[],
  hexSize: number,
  maxDistanceRatio = 1.15,
): HexCoord | null {
  const maxDistSq = (hexSize * maxDistanceRatio) ** 2;
  let best: HexCoord | null = null;
  let bestDistSq = maxDistSq;

  for (const tile of tiles) {
    const dx = x - tile.cx;
    const dy = y - tile.cy;
    const distSq = dx * dx + dy * dy;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      best = tile.coord;
    }
  }

  return best;
}
