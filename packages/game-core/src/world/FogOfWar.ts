/** TODO: Fog of war for unexplored map areas. */
export class FogOfWar {
  private revealed: Set<string> = new Set();

  reveal(x: number, y: number): void {
    this.revealed.add(`${x},${y}`);
  }

  isRevealed(x: number, y: number): boolean {
    return this.revealed.has(`${x},${y}`);
  }
}
