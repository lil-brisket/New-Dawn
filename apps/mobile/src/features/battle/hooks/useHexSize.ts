import { useMemo } from 'react';
import type { GridAxisConfig } from '../theme/battlePlatformLayout';
import { axisMarginBand, gridPixelSize } from '../utils/hexLayout';

/**
 * Solve for the largest hex size that fits the viewport without scrolling.
 * Inverts gridPixelSize formulas from hexLayout.ts.
 */
export function solveHexSize(
  gridWidth: number,
  gridHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  gridPadding: number,
  hexSizeMin: number,
  reserveAxisLabels = true,
  axis: GridAxisConfig = { marginRatio: 0.6, marginMin: 20 },
): number {
  if (viewportWidth <= 0 || viewportHeight <= 0 || gridWidth <= 0 || gridHeight <= 0) {
    return hexSizeMin;
  }

  const sqrt3 = Math.sqrt(3);
  const widthCoeff = sqrt3 * (gridWidth - 0.5) + 2;
  const heightCoeff = 1.5 * (gridHeight - 1) + 2;

  let size = hexSizeMin;
  for (let i = 0; i < 10; i++) {
    const margin = reserveAxisLabels ? axisMarginBand(size, axis) : 0;
    const sizeByWidth = (viewportWidth - gridPadding * 2 - margin) / widthCoeff;
    const sizeByHeight = (viewportHeight - gridPadding * 2 - margin) / heightCoeff;
    const next = Math.floor(Math.min(sizeByWidth, sizeByHeight));
    if (next <= size) {
      return Math.max(hexSizeMin, next);
    }
    size = next;
  }

  return Math.max(hexSizeMin, size);
}

/** Grow hex size until the rendered SVG fills the viewport (web wide screens). */
export function growHexSizeToViewport(
  hexSize: number,
  gridWidth: number,
  gridHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  gridPadding: number,
  hexSizeMax: number,
  reserveAxisLabels: boolean,
  axis: GridAxisConfig,
): number {
  if (viewportWidth <= 0 || viewportHeight <= 0) return hexSize;

  const layoutOptions = { reserveAxisLabels, axis };
  let size = hexSize;

  for (let i = 0; i < 8; i++) {
    const { svgWidth, svgHeight } = gridPixelSize(
      gridWidth,
      gridHeight,
      size,
      gridPadding,
      layoutOptions,
    );
    const scale = Math.min(viewportWidth / svgWidth, viewportHeight / svgHeight);
    if (scale <= 1.02) return size;

    const grown = Math.min(Math.floor(size * scale * 0.99), hexSizeMax);
    if (grown <= size) return size;
    size = grown;
  }

  return size;
}

export function useHexSize(
  gridWidth: number,
  gridHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  gridPadding: number,
  hexSizeMin: number,
  reserveAxisLabels: boolean,
  axis: GridAxisConfig,
): number {
  return useMemo(
    () =>
      solveHexSize(
        gridWidth,
        gridHeight,
        viewportWidth,
        viewportHeight,
        gridPadding,
        hexSizeMin,
        reserveAxisLabels,
        axis,
      ),
    [
      gridWidth,
      gridHeight,
      viewportWidth,
      viewportHeight,
      gridPadding,
      hexSizeMin,
      reserveAxisLabels,
      axis.marginRatio,
      axis.marginMin,
    ],
  );
}
