import type { ShieldEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { withShield } from '../../../entities/Combatant';
import { getCombatant } from '../../../queries/getActiveCombatant';
import { updateMap } from '../../../utils/immutable';
import { createEffectContext } from '../../scaling/EffectContext';
import { evaluateFormula } from '../../scaling/getEffectiveStat';

const MAX_SHIELD_TURNS = 2;

export function resolveShieldEffect(effect: ShieldEffect, ctx: AbilityContext): void {
  const combatStats = ctx.registry.getCombatStatsConfig();
  const duration = Math.min(MAX_SHIELD_TURNS, effect.duration ?? MAX_SHIELD_TURNS);

  for (const target of ctx.targets) {
    const liveTarget = getCombatant(ctx.battle, target.id);
    if (!liveTarget) continue;

    const effectCtx = createEffectContext({
      source: ctx.source,
      target: liveTarget,
      battle: ctx.battle,
      registry: ctx.registry,
      combatStats,
      rng: ctx.rng,
      skill: ctx.skill,
    });

    const amount = Math.max(0, Math.floor(evaluateFormula(effect.value, effectCtx)));
    if (amount <= 0) continue;

    const existingShield = liveTarget.shieldHp ?? 0;
    const updated = withShield(
      liveTarget,
      existingShield + amount,
      Math.max(liveTarget.shieldTurns ?? 0, duration),
    );

    ctx.battle = {
      ...ctx.battle,
      combatants: updateMap(ctx.battle.combatants, target.id, updated),
    };

    ctx.events.push({
      type: 'shield_applied',
      sourceId: ctx.source.id,
      targetId: target.id,
      amount,
      turns: duration,
      skillId: ctx.skill?.id,
    });
  }
}
