export function calculateDamage(attack: number, defense: number): number {
  return Math.max(1, attack - defense);
}
