import type { ApplicationFormula, CombatStatId, DurationFormula } from '@dawn/types';
import type { EffectContext } from './EffectContext';
import { evaluateFormula, getEffectiveStat } from './getEffectiveStat';
import { formulaModifierRegistry } from './modifierRegistry';

export function calculateApplicationChance(
  baseChance: number,
  ctx: EffectContext,
  formula?: ApplicationFormula,
): number {
  const config = formula ?? ctx.combatStats.formulas.tagApplication;
  const attackerValue = getEffectiveStat(ctx, config.attackerStat, ctx.source);
  const defenderValue = getEffectiveStat(ctx, config.defenderStat, ctx.target);
  const delta = (attackerValue - defenderValue) * config.perPointDelta;
  const chance = baseChance + delta;
  return formulaModifierRegistry.apply('application_chance', Math.max(0, Math.min(1, chance)), ctx);
}

export function calculateDuration(
  baseDuration: number,
  ctx: EffectContext,
  durationFormula?: DurationFormula,
): number {
  let duration = baseDuration;

  if (durationFormula) {
    const bonus = evaluateFormula(
      {
        base: 0,
        terms: [{ source: 'stat', key: durationFormula.stat, ratio: durationFormula.ratio }],
      },
      ctx,
    );
    const capped =
      durationFormula.maxBonus !== undefined ? Math.min(durationFormula.maxBonus, bonus) : bonus;
    duration += capped;
  }

  duration = formulaModifierRegistry.apply('duration', duration, ctx);

  const reduction = ctx.combatStats.formulas.durationReduction;
  const defenderValue = getEffectiveStat(ctx, reduction.defenderStat, ctx.target);
  duration -= Math.floor(defenderValue * reduction.perPointReduction);

  return Math.max(reduction.minDuration, Math.floor(duration));
}

export function createSourceSnapshots(
  ctx: EffectContext,
  statIds: readonly CombatStatId[],
): Readonly<Partial<Record<CombatStatId, number>>> {
  const snapshots: Partial<Record<CombatStatId, number>> = {};
  for (const statId of statIds) {
    snapshots[statId] = getEffectiveStat(ctx, statId, ctx.source);
  }
  return snapshots;
}
