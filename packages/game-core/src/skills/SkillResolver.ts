import type { BattleState, SkillEffect } from '@dawn/types';
import { calculateDamage } from '../combat/DamageCalculator';
import type { SystemContext } from '../battle/Systems/System';

export function resolveSkillEffects(
  state: BattleState,
  actorId: string,
  targetIds: string[],
  effects: SkillEffect[],
  ctx: SystemContext,
): void {
  const actor = state.entities[actorId];
  if (!actor) return;

  for (const effect of effects) {
    switch (effect.type) {
      case 'damage': {
        for (const targetId of targetIds) {
          const target = state.entities[targetId];
          if (!target || !target.isAlive) continue;

          const result = calculateDamage(
            {
              sourceId: actorId,
              targetId,
              attack: actor.stats.attack,
              defense: target.stats.defense,
              multiplier: effect.multiplier,
              critRate: actor.stats.critRate,
              critDamage: actor.stats.critDamage,
            },
            ctx.engine.random,
          );

          target.stats.hp = Math.max(0, target.stats.hp - result.finalDamage);

          ctx.eventBus.emit({
            type: 'damage_taken',
            sourceId: actorId,
            targetId,
            amount: result.finalDamage,
            isCritical: result.isCritical,
          });
        }
        break;
      }
      case 'heal': {
        for (const targetId of targetIds) {
          const target = state.entities[targetId];
          if (!target) continue;
          const heal = Math.floor(actor.stats.attack * effect.multiplier + (effect.flatBonus ?? 0));
          target.stats.hp = Math.min(target.stats.maxHp, target.stats.hp + heal);
        }
        break;
      }
      case 'apply_status': {
        if (!ctx.engine.random.chance(effect.chance)) break;
        for (const targetId of targetIds) {
          const target = state.entities[targetId];
          if (!target) continue;
          target.statusEffectIds.push(effect.statusId);
          ctx.eventBus.emit({
            type: 'buff_applied',
            sourceId: actorId,
            targetId,
            statusId: effect.statusId,
          });
        }
        break;
      }
      case 'move':
      case 'summon':
        // TODO: implement move and summon effects
        break;
    }
  }
}
