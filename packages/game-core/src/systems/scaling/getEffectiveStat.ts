import type { CombatStatId } from '@dawn/types';
import type { EffectContext } from './EffectContext';
import { getEffectiveStatForCombatant } from '../status/getEffectiveStats';

export function getCombatantStat(combatant: EffectContext['source'], statId: CombatStatId): number {
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

export function getEffectiveStat(
  ctx: EffectContext,
  statId: CombatStatId,
  combatant: EffectContext['source'] = ctx.source,
): number {
  return getEffectiveStatForCombatant(combatant, statId, ctx.registry);
}

function resolveTermValue(
  term: { source: string; key: string; ratio: number },
  ctx: EffectContext,
  instance?: { stacks: number; sourceSnapshots?: Readonly<Partial<Record<CombatStatId, number>>> },
): number {
  switch (term.source) {
    case 'stat': {
      const snapshots = instance?.sourceSnapshots;
      if (snapshots && term.key in snapshots) {
        return (snapshots[term.key as CombatStatId] ?? 0) * term.ratio;
      }
      return getEffectiveStat(ctx, term.key as CombatStatId) * term.ratio;
    }
    case 'stacks':
      return (instance?.stacks ?? 1) * term.ratio;
    default:
      return 0;
  }
}

export function evaluateFormula(
  formula: { base: number; terms: readonly { source: string; key: string; ratio: number }[] },
  ctx: EffectContext,
  instance?: { stacks: number; sourceSnapshots?: Readonly<Partial<Record<CombatStatId, number>>> },
): number {
  let total = formula.base;
  for (const term of formula.terms) {
    total += resolveTermValue(term, ctx, instance);
  }
  return Math.floor(total);
}
