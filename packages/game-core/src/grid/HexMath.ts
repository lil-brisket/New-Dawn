import { HEX_DIRECTIONS } from './HexDirection';
import type { HexCoord } from './HexCoord';

export function equals(a: HexCoord, b: HexCoord): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}

export function add(a: HexCoord, b: HexCoord): HexCoord {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function subtract(a: HexCoord, b: HexCoord): HexCoord {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function scale(coord: HexCoord, factor: number): HexCoord {
  return { x: coord.x * factor, y: coord.y * factor, z: coord.z * factor };
}

export function distance(a: HexCoord, b: HexCoord): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  const dz = Math.abs(a.z - b.z);
  return Math.max(dx, dy, dz);
}

export function neighbors(coord: HexCoord): HexCoord[] {
  return HEX_DIRECTIONS.map((dir) => add(coord, dir));
}

export function direction(from: HexCoord, to: HexCoord): HexCoord | null {
  const diff = subtract(to, from);
  const dist = distance(from, to);
  if (dist === 0) return null;
  const scaled = scale(diff, 1 / dist);
  const match = HEX_DIRECTIONS.find((d) => equals(d, scaled));
  return match ?? null;
}

export function lerp(a: HexCoord, b: HexCoord, t: number): HexCoord {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

export function round(coord: HexCoord): HexCoord {
  let rx = Math.round(coord.x);
  let ry = Math.round(coord.y);
  let rz = Math.round(coord.z);

  const xDiff = Math.abs(rx - coord.x);
  const yDiff = Math.abs(ry - coord.y);
  const zDiff = Math.abs(rz - coord.z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return { x: rx, y: ry + 0, z: rz + 0 };
}

export function line(a: HexCoord, b: HexCoord): HexCoord[] {
  const n = distance(a, b);
  if (n === 0) return [a];

  const results: HexCoord[] = [];
  for (let i = 0; i <= n; i++) {
    results.push(round(lerp(a, b, i / n)));
  }
  return results;
}
