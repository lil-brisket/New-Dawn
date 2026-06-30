import type { DefinitionRegistry } from '@dawn/game-data';
import type { Combatant } from '@dawn/types';

export function hasControlEffect(combatant: Combatant, registry: DefinitionRegistry): boolean {
  for (const instance of combatant.statuses) {
    const def = registry.getStatus(instance.statusDefinitionId);
    if (!def) continue;
    for (const behavior of def.behaviors) {
      if (behavior.type === 'control' && behavior.effect === 'stun') {
        return true;
      }
    }
  }
  return false;
}

export function isStunned(combatant: Combatant, registry: DefinitionRegistry): boolean {
  return hasControlEffect(combatant, registry);
}
