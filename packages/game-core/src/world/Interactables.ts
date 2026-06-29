/** TODO: Handle interactable objects (chests, doors, switches). */
export class Interactables {
  private items: Map<string, { id: string; type: string }> = new Map();

  register(id: string, type: string): void {
    this.items.set(id, { id, type });
  }
}
