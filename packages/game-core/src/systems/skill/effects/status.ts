import type { BuffEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { createEffectContext } from '../../scaling/EffectContext';
import { resolveStatusApplication } from '../../status/resolveStatusApplication';

export function resolveStatusEffect(effect: BuffEffect, ctx: AbilityContext): void {
  const combatStats = ctx.registry.getCombatStatsConfig();

  for (const target of ctx.targets) {
    const effectCtx = createEffectContext({
      source: ctx.source,
      target,
      battle: ctx.battle,
      registry: ctx.registry,
      combatStats,
      rng: ctx.rng,
      skill: ctx.skill,
    });

    const result = resolveStatusApplication({
      ctx: effectCtx,
      statusId: effect.statusId,
      baseChance: effect.chance,
      baseDuration: effect.duration,
      durationFormula: effect.durationFormula,
      applicationFormula: effect.applicationFormula,
    });

    ctx.battle = result.state;
    ctx.events.push(...result.events);
  }
}
