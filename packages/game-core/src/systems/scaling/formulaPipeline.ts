import type { StatFormula } from '@dawn/types';
import type { EffectContext } from './EffectContext';
import { evaluateFormula, getEffectiveStat } from './getEffectiveStat';
import { formulaModifierRegistry } from './modifierRegistry';

export function calculateOffense(formula: StatFormula, ctx: EffectContext): number {
  const raw = evaluateFormula(formula, ctx);
  return formulaModifierRegistry.apply('offense', raw, ctx);
}

export function calculateMitigation(_offense: number, ctx: EffectContext): number {
  const mitigation = getEffectiveStat(ctx, 'defense', ctx.target);
  return formulaModifierRegistry.apply('mitigation', mitigation, ctx);
}

export function calculateFinalDamage(
  offense: number,
  mitigation: number,
  ctx: EffectContext,
): number {
  const raw = Math.max(1, offense - mitigation);
  return formulaModifierRegistry.apply('final', raw, ctx);
}

export function resolveDamage(formula: StatFormula, ctx: EffectContext): number {
  const offense = calculateOffense(formula, ctx);
  const mitigation = calculateMitigation(offense, ctx);
  return calculateFinalDamage(offense, mitigation, ctx);
}

export function resolveHealing(formula: StatFormula, ctx: EffectContext): number {
  let amount = evaluateFormula(formula, ctx);
  amount = formulaModifierRegistry.apply('heal', amount, ctx);
  return Math.max(0, amount);
}

export function resolveBarrier(formula: StatFormula, ctx: EffectContext): number {
  return resolveHealing(formula, ctx);
}

export function resolveBuffValue(formula: StatFormula, ctx: EffectContext): number {
  return evaluateFormula(formula, ctx);
}
