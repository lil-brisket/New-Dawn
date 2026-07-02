import type { ApplyTagEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { createEffectContext } from '../../scaling/EffectContext';
import { resolveTagApplication } from '../../tag/resolveTagApplication';

export function resolveApplyTagEffect(effect: ApplyTagEffect, ctx: AbilityContext): void {
  const combatStats = ctx.registry.getCombatStatsConfig();
  const tagDef = ctx.registry.getTag(effect.tagId);
  const isMovement = tagDef?.behaviors.some((b) => b.type === 'move' || b.type === 'teleport');

  const targets = ctx.targets.length > 0 ? ctx.targets : isMovement ? [ctx.source] : [];

  for (const target of targets) {
    const effectCtx = createEffectContext({
      source: ctx.source,
      target,
      battle: ctx.battle,
      registry: ctx.registry,
      combatStats,
      rng: ctx.rng,
      skill: ctx.skill,
    });

    const result = resolveTagApplication({
      ctx: effectCtx,
      tagId: effect.tagId,
      baseChance: effect.chance,
      baseDuration: effect.duration,
      durationFormula: effect.durationFormula,
      applicationFormula: effect.applicationFormula,
      overrides: effect.overrides,
      targetTile: ctx.targetTile,
    });

    ctx.battle = result.state;
    ctx.events.push(...result.events);
  }
}

/** @deprecated Use resolveApplyTagEffect */
export const resolveStatusEffect = resolveApplyTagEffect;
