/** TODO: Map trigger zones (quests, cutscenes). */
export class Triggers {
  private triggers: Map<string, { id: string; condition: string }> = new Map();

  register(id: string, condition: string): void {
    this.triggers.set(id, { id, condition });
  }
}
