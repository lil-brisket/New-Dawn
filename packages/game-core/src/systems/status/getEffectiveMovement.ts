import type { DefinitionRegistry } from '@dawn/game-data';
import type { Combatant } from '@dawn/types';

export function getEffectiveMovement(combatant: Combatant, registry: DefinitionRegistry): number {
  let movement = combatant.movement;

  for (const instance of combatant.statuses) {
    const def = registry.getStatus(instance.statusDefinitionId);
    if (!def) continue;

    for (const behavior of def.behaviors) {
      if (behavior.type === 'control' && behavior.effect === 'bind') {
        movement = Math.max(1, movement - 1);
      }
    }
  }

  return movement;
}

export function isBound(combatant: Combatant, registry: DefinitionRegistry): boolean {
  for (const instance of combatant.statuses) {
    const def = registry.getStatus(instance.statusDefinitionId);
    if (!def) continue;
    for (const behavior of def.behaviors) {
      if (behavior.type === 'control' && behavior.effect === 'bind') {
        return true;
      }
    }
  }
  return false;
}
