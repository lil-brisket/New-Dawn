export interface Tile {
  id: string;
  x: number;
  y: number;
  tilesetId: string;
  walkable: boolean;
}

export interface NPC {
  id: string;
  definitionId: string;
  x: number;
  y: number;
  dialogueIds: string[];
}

export interface Interactable {
  id: string;
  type: 'chest' | 'door' | 'switch' | 'quest_giver';
  x: number;
  y: number;
  data: Record<string, string>;
}

export interface MapData {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: Tile[];
  npcs: NPC[];
  interactables: Interactable[];
  spawnPoint: { x: number; y: number };
}
