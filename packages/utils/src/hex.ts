import type { HexCoord } from '@dawn/types';

export const HEX_DIRECTIONS: readonly HexCoord[] = [
  { x: 1, y: -1, z: 0 },
  { x: 1, y: 0, z: -1 },
  { x: 0, y: 1, z: -1 },
  { x: -1, y: 1, z: 0 },
  { x: -1, y: 0, z: 1 },
  { x: 0, y: -1, z: 1 },
] as const;

export function hexToKey(coord: HexCoord): string {
  return `${coord.x},${coord.y},${coord.z}`;
}

export function hexFromKey(key: string): HexCoord {
  const [x, y, z] = key.split(',').map(Number);
  return { x: x ?? 0, y: y ?? 0, z: z ?? 0 };
}

export function hexEquals(a: HexCoord, b: HexCoord): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}

export function hexDistance(a: HexCoord, b: HexCoord): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  const dz = Math.abs(a.z - b.z);
  return Math.max(dx, dy, dz);
}

export function hexNeighbors(coord: HexCoord): HexCoord[] {
  return HEX_DIRECTIONS.map((dir) => ({
    x: coord.x + dir.x,
    y: coord.y + dir.y,
    z: coord.z + dir.z,
  }));
}

export function hexAdd(a: HexCoord, b: HexCoord): HexCoord {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function createHex(x: number, y: number): HexCoord {
  return { x, y, z: -x - y };
}
