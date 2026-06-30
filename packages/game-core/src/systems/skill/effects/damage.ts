import type { DamageEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { withHp } from '../../../entities/Combatant';
import { getCombatant } from '../../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../../queries/isCombatantAlive';
import { updateMap } from '../../../utils/immutable';
import { getEffectiveStats } from '../../status/getEffectiveStats';
import { calculateDamage } from '../../combat/Damage';

export function resolveDamageEffect(effect: DamageEffect, ctx: AbilityContext): void {
  const sourceStats = getEffectiveStats(ctx.source, ctx.registry);
  const skillId = ctx.skill?.id;

  for (const target of ctx.targets) {
    const liveTarget = getCombatant(ctx.battle, target.id);
    if (!liveTarget || !isCombatantAlive(liveTarget)) continue;

    const targetStats = getEffectiveStats(liveTarget, ctx.registry);
    const rawAttack = Math.floor(sourceStats.attack * effect.multiplier + (effect.flatBonus ?? 0));
    const damage = calculateDamage(rawAttack, targetStats.defense);
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
