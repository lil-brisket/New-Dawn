import type { HexCoord } from '@dawn/types';

export type { HexCoord };

export function createHex(x: number, y: number): HexCoord {
  const z = -x - y;
  return { x, y, z: z + 0 };
}

export function isValidHex(coord: HexCoord): boolean {
  return coord.x + coord.y + coord.z === 0;
}
