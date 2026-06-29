export interface HexCoord {
  q: number;
  r: number;
}

export interface HexCell {
  coord: HexCoord;
  walkable: boolean;
  elevation: number;
  terrainId: string;
}
