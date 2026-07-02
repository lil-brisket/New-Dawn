import type { TagBehavior } from '@dawn/types';
import type { AbilityContext } from '../skill/AbilityContext';
import { withHp, withPosition, withShield, withTags } from '../../entities/Combatant';
import { getCombatant } from '../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../queries/isCombatantAlive';
import { updateMap } from '../../utils/immutable';
import { equals } from '../../grid/HexMath';
import { createEffectContext } from '../scaling/EffectContext';
import { evaluateFormula } from '../scaling/getEffectiveStat';
import { calculateOffense, resolveDamage, resolveHealing } from '../scaling/formulaPipeline';
import {
  applyIncomingDamage,
  isAliveAfterDamage,
  shieldAbsorbedEvent,
} from '../combat/resolveIncomingDamage';
import { processDamageModifiers } from './damageModifiers';

const MAX_SHIELD_TURNS = 2;

export function executeTagBehaviors(
  ctx: AbilityContext,
  behaviors: readonly TagBehavior[],
  tagId: string,
): void {
  const combatStats = ctx.registry.getCombatStatsConfig();
  const skillId = ctx.skill?.id;

  for (const behavior of behaviors) {
    if (behavior.type === 'instant_damage') {
      for (const target of ctx.targets) {
        const liveTarget = getCombatant(ctx.battle, target.id);
        if (!liveTarget || !isCombatantAlive(liveTarget)) continue;

        const pierce = behavior.pierce === true;
        const effectCtx = createEffectContext({
          source: ctx.source,
          target: liveTarget,
          battle: ctx.battle,
          registry: ctx.registry,
          combatStats,
          rng: ctx.rng,
          skill: ctx.skill,
          ignoreStatMods: pierce,
        });

        const damage = pierce
          ? Math.max(1, calculateOffense(behavior.value, effectCtx))
          : resolveDamage(behavior.value, effectCtx);

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
            element: behavior.element,
            tagId,
            pierce,
          });

          if (!pierce) {
            const modResult = processDamageModifiers({
              state: ctx.battle,
              sourceId: ctx.source.id,
              targetId: target.id,
              hpDamage: result.hpDamage,
              registry: ctx.registry,
              combatStats,
              rng: ctx.rng,
              skill: ctx.skill,
            });
            ctx.battle = modResult.state;
            ctx.events.push(...modResult.events);
          }
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

    if (behavior.type === 'instant_heal') {
      const source = getCombatant(ctx.battle, ctx.source.id) ?? ctx.source;
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

        const amount = resolveHealing(behavior.value, effectCtx);
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

    if (behavior.type === 'shield_grant') {
      const duration = Math.min(MAX_SHIELD_TURNS, behavior.duration ?? MAX_SHIELD_TURNS);
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

        const amount = Math.max(0, Math.floor(evaluateFormula(behavior.value, effectCtx)));
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
          skillId,
        });
      }
    }

    if (behavior.type === 'move' || behavior.type === 'teleport') {
      if (!ctx.targetTile) continue;
      const source = getCombatant(ctx.battle, ctx.source.id);
      if (!source) continue;

      const from = source.position;
      const to = ctx.targetTile;
      if (!equals(from, to)) {
        const updated = withPosition(source, to);
        ctx.battle = {
          ...ctx.battle,
          combatants: updateMap(ctx.battle.combatants, source.id, updated),
        };
        ctx.source = updated;
        ctx.events.push({
          type: 'combatant_moved',
          combatantId: source.id,
          from,
          to,
        });
      }
    }

    if (behavior.type === 'clear' || behavior.type === 'cleanse') {
      for (const target of ctx.targets) {
        ctx.battle = dispelTags(
          ctx.battle,
          target.id,
          behavior.type === 'clear' ? 'buff' : 'debuff',
          ctx,
        );
      }
    }
  }
}

function dispelTags(
  state: AbilityContext['battle'],
  targetId: string,
  category: 'buff' | 'debuff',
  ctx: AbilityContext,
): AbilityContext['battle'] {
  const target = getCombatant(state, targetId);
  if (!target) return state;

  const remaining = target.tags.filter((instance) => {
    const def = ctx.registry.getTag(instance.tagDefinitionId);
    if (!def || def.category !== category) return true;
    ctx.events.push({
      type: 'tag_removed',
      targetId,
      tagId: instance.tagDefinitionId,
    });
    return false;
  });

  if (remaining.length === target.tags.length) return state;

  return {
    ...state,
    combatants: updateMap(state.combatants, targetId, withTags(target, remaining)),
  };
}

export function processDotDamageModifiers(
  ctx: AbilityContext,
  sourceId: string,
  targetId: string,
  hpDamage: number,
  tagId: string,
): void {
  if (hpDamage <= 0) return;
  const combatStats = ctx.registry.getCombatStatsConfig();
  const modResult = processDamageModifiers({
    state: ctx.battle,
    sourceId,
    targetId,
    hpDamage,
    registry: ctx.registry,
    combatStats,
    rng: ctx.rng,
  });
  ctx.battle = modResult.state;
  ctx.events.push(...modResult.events);
  void tagId;
}
