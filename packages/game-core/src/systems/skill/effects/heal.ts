import type { HealEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { withHp } from '../../../entities/Combatant';
import { getCombatant } from '../../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../../queries/isCombatantAlive';
import { updateMap } from '../../../utils/immutable';
import { createEffectContext } from '../../scaling/EffectContext';
import { resolveHealing } from '../../scaling/formulaPipeline';

export function resolveHealEffect(effect: HealEffect, ctx: AbilityContext): void {
  const skillId = ctx.skill?.id;
  const source = getCombatant(ctx.battle, ctx.source.id) ?? ctx.source;
  const combatStats = ctx.registry.getCombatStatsConfig();

  for (const target of ctx.targets) {
    const liveTarget = getCombatant(ctx.battle, target.id);
    if (!liveTarget || !isCombatantAlive(liveTarget)) continue;

    const effectCtx = createEffectContext({
      source,
      target: liveTarget,
      battle: ctx.battle,
      registry: ctx.registry,
      combatStats,
      rng: ctx.rng,
      skill: ctx.skill,
    });

    const amount = resolveHealing(effect.value, effectCtx);
    const updated = withHp(liveTarget, Math.min(liveTarget.maxHp, liveTarget.hp + amount));

    ctx.battle = {
      ...ctx.battle,
      combatants: updateMap(ctx.battle.combatants, target.id, updated),
    };

    ctx.events.push({
      type: 'heal_applied',
      sourceId: source.id,
      targetId: target.id,
      amount,
      reason: 'skill',
      skillId,
    });
  }
}
