import type { HexCoord } from '@dawn/types';

/** Deterministic hash from cube coordinates — stable across sessions */
export function hashCoord(coord: HexCoord): number {
  const n = (coord.x * 73856093) ^ (coord.y * 19349663) ^ (coord.z * 83492791);
  return Math.abs(n);
}

export type TileVariant = 0 | 1 | 2;

export function tileVariant(coord: HexCoord): TileVariant {
  return (hashCoord(coord) % 3) as TileVariant;
}
