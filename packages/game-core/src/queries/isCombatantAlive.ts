import type { Combatant } from '@dawn/types';

export function isCombatantAlive(combatant: Combatant): boolean {
  return combatant.hp > 0;
}
