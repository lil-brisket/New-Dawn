import type { DefinitionRegistry } from '@dawn/game-data';
import type { Combatant, CombatStatId } from '@dawn/types';
import type { RandomSource } from '@dawn/utils';
import type { EffectContext } from '../scaling/EffectContext';
import { evaluateFormula } from '../scaling/getEffectiveStat';

export interface EffectiveStats {
  readonly attack: number;
  readonly defense: number;
}

const noopRng: RandomSource = {
  chance: () => true,
  next: () => 0.5,
  nextInt: (min) => min,
};

function getCombatantStatValue(combatant: Combatant, statId: CombatStatId): number {
  switch (statId) {
    case 'attack':
      return combatant.attack;
    case 'defense':
      return combatant.defense;
    case 'speed':
      return combatant.speed;
    case 'willpower':
      return combatant.willpower;
    case 'resistance':
      return combatant.resistance;
    default:
      return 0;
  }
}

export function getEffectiveStatForCombatant(
  combatant: Combatant,
  statId: CombatStatId,
  registry: DefinitionRegistry,
): number {
  let value = getCombatantStatValue(combatant, statId);

  for (const instance of combatant.statuses) {
    const def = registry.getStatus(instance.statusDefinitionId);
    if (!def) continue;

    for (const behavior of def.behaviors) {
      if (behavior.type !== 'stat_mod' || behavior.stat !== statId) continue;

      const amountPerStack = evaluateFormula(behavior.value, {
        source: combatant,
        target: combatant,
        battle: {} as EffectContext['battle'],
        registry,
        combatStats: registry.getCombatStatsConfig(),
        rng: noopRng,
      });
      const total = amountPerStack * instance.stacks;

      if (behavior.mode === 'flat') {
        value += total;
      } else {
        value = value * (1 + total / 100);
      }
    }
  }

  return Math.max(0, Math.floor(value));
}

export function getEffectiveStats(
  combatant: Combatant,
  registry: DefinitionRegistry,
): EffectiveStats {
  return {
    attack: getEffectiveStatForCombatant(combatant, 'attack', registry),
    defense: getEffectiveStatForCombatant(combatant, 'defense', registry),
  };
}
