import type { HexCoord } from '@dawn/types';

export function coordToKey(coord: HexCoord): string {
  return `${coord.x},${coord.y},${coord.z}`;
}

export function keyToCoord(key: string): HexCoord {
  const [x, y, z] = key.split(',').map(Number);
  return { x: x ?? 0, y: y ?? 0, z: z ?? 0 };
}
