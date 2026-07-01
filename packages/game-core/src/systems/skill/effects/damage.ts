import type { DamageEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { getCombatant } from '../../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../../queries/isCombatantAlive';
import { updateMap } from '../../../utils/immutable';
import { createEffectContext } from '../../scaling/EffectContext';
import { calculateOffense, resolveDamage } from '../../scaling/formulaPipeline';
import {
  applyIncomingDamage,
  isAliveAfterDamage,
  shieldAbsorbedEvent,
} from '../../combat/resolveIncomingDamage';

export function resolveDamageEffect(effect: DamageEffect, ctx: AbilityContext): void {
  const skillId = ctx.skill?.id;
  const combatStats = ctx.registry.getCombatStatsConfig();
  const pierce = effect.pierce === true;

  for (const target of ctx.targets) {
    const liveTarget = getCombatant(ctx.battle, target.id);
    if (!liveTarget || !isCombatantAlive(liveTarget)) continue;

    const effectCtx = createEffectContext({
      source: ctx.source,
      target: liveTarget,
      battle: ctx.battle,
      registry: ctx.registry,
      combatStats,
      rng: ctx.rng,
      skill: ctx.skill,
    });

    const damage = pierce
      ? Math.max(1, calculateOffense(effect.value, effectCtx))
      : resolveDamage(effect.value, effectCtx);

    const result = applyIncomingDamage(liveTarget, damage, pierce);

    ctx.battle = {
      ...ctx.battle,
      combatants: updateMap(ctx.battle.combatants, target.id, result.combatant),
    };

    if (result.shieldsBroken) {
      ctx.events.push({
        type: 'shield_broken',
        targetId: target.id,
        sourceId: ctx.source.id,
        skillId,
      });
    }

    if (result.shieldDamage > 0) {
      ctx.events.push(shieldAbsorbedEvent(target.id, result.shieldDamage, ctx.source.id));
    }

    if (result.hpDamage > 0) {
      ctx.events.push({
        type: 'damage_dealt',
        sourceId: ctx.source.id,
        targetId: target.id,
        amount: result.hpDamage,
        reason: 'skill',
        skillId,
        element: effect.element,
        pierce,
      });
    }

    if (!isAliveAfterDamage(result.combatant)) {
      ctx.events.push({
        type: 'combatant_killed',
        combatantId: target.id,
        killerId: ctx.source.id,
      });
    }
  }
}
