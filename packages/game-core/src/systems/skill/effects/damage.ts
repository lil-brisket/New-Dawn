import type { DamageEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { withHp } from '../../../entities/Combatant';
import { getCombatant } from '../../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../../queries/isCombatantAlive';
import { updateMap } from '../../../utils/immutable';
import { createEffectContext } from '../../scaling/EffectContext';
import { resolveDamage } from '../../scaling/formulaPipeline';

export function resolveDamageEffect(effect: DamageEffect, ctx: AbilityContext): void {
  const skillId = ctx.skill?.id;
  const combatStats = ctx.registry.getCombatStatsConfig();

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

    const damage = resolveDamage(effect.value, effectCtx);
    const updated = withHp(liveTarget, liveTarget.hp - damage);

    ctx.battle = {
      ...ctx.battle,
      combatants: updateMap(ctx.battle.combatants, target.id, updated),
    };

    ctx.events.push({
      type: 'damage_dealt',
      sourceId: ctx.source.id,
      targetId: target.id,
      amount: damage,
      reason: 'skill',
      skillId,
      element: effect.element,
    });

    if (!isCombatantAlive(updated)) {
      ctx.events.push({
        type: 'combatant_killed',
        combatantId: target.id,
        killerId: ctx.source.id,
      });
    }
  }
}
