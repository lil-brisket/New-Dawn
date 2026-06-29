/** TODO: Manage NPC entities on the world map. */
export class NPCManager {
  private npcs: Map<string, { id: string; x: number; y: number }> = new Map();

  add(id: string, x: number, y: number): void {
    this.npcs.set(id, { id, x, y });
  }

  getAll(): Array<{ id: string; x: number; y: number }> {
    return Array.from(this.npcs.values());
  }
}
