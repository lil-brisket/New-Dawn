import type { HexCoord } from '@dawn/types';
import { hexDistance } from '@dawn/utils';

export function isInRange(origin: HexCoord, target: HexCoord, range: number): boolean {
  return hexDistance(origin, target) <= range;
}

export function getEntitiesInRange(
  origin: HexCoord,
  positions: Array<{ id: string; position: HexCoord }>,
  range: number,
): string[] {
  return positions.filter((p) => hexDistance(origin, p.position) <= range).map((p) => p.id);
}
