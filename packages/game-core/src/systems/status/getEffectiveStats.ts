import type { DefinitionRegistry } from '@dawn/game-data';
import type { Combatant } from '@dawn/types';

export interface EffectiveStats {
  readonly attack: number;
  readonly defense: number;
}

export function getEffectiveStats(
  combatant: Combatant,
  registry: DefinitionRegistry,
): EffectiveStats {
  let attack = combatant.attack;
  let defense = combatant.defense;

  for (const instance of combatant.statuses) {
    const def = registry.getStatus(instance.statusDefinitionId);
    if (!def) continue;

    for (const behavior of def.behaviors) {
      if (behavior.type !== 'stat_mod') continue;

      const total = behavior.amountPerStack * instance.stacks;
      if (behavior.stat === 'attack') {
        attack = behavior.mode === 'flat' ? attack + total : attack * (1 + total / 100);
      } else {
        defense = behavior.mode === 'flat' ? defense + total : defense * (1 + total / 100);
      }
    }
  }

  return {
    attack: Math.max(0, Math.floor(attack)),
    defense: Math.max(0, Math.floor(defense)),
  };
}
