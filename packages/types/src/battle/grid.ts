export interface HexCoord {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface Tile {
  readonly coord: HexCoord;
  readonly walkable: boolean;
}

export interface Grid {
  readonly width: number;
  readonly height: number;
  readonly tiles: ReadonlyMap<string, Tile>;
}

/** @deprecated Use Tile for battle maps */
export interface HexCell {
  coord: HexCoord;
  walkable: boolean;
  elevation: number;
  terrainId: string;
}
