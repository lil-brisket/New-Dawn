export interface LootDroppedEvent {
  type: 'loot_dropped';
  itemId: string;
  quantity: number;
  position: { x: number; y: number };
}

export interface NPCTalkedEvent {
  type: 'npc_talked';
  npcId: string;
  dialogueId: string;
}

export interface MapEnteredEvent {
  type: 'map_entered';
  mapId: string;
}

export type WorldEvent = LootDroppedEvent | NPCTalkedEvent | MapEnteredEvent;

export type WorldEventType = WorldEvent['type'];
