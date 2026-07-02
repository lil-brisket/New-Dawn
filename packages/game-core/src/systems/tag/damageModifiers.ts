import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState, CombatStatsConfig, SkillDefinition } from '@dawn/types';
import type { RandomSource } from '@dawn/utils';
import { withHp } from '../../entities/Combatant';
import { getCombatant } from '../../queries/getActiveCombatant';
import { updateMap } from '../../utils/immutable';
import { createEffectContext } from '../scaling/EffectContext';
import { evaluateFormula } from '../scaling/getEffectiveStat';
import { applyIncomingDamage } from '../combat/resolveIncomingDamage';

export interface DamageModifierInput {
  readonly state: BattleState;
  readonly sourceId: string;
  readonly targetId: string;
  readonly hpDamage: number;
  readonly registry: DefinitionRegistry;
  readonly combatStats: CombatStatsConfig;
  readonly rng: RandomSource;
  readonly skill?: SkillDefinition;
}

export interface DamageModifierResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

export function processDamageModifiers(input: DamageModifierInput): DamageModifierResult {
  const events: BattleEvent[] = [];
  let state = input.state;

  const source = getCombatant(state, input.sourceId);
  const target = getCombatant(state, input.targetId);
  if (!target || input.hpDamage <= 0) {
    return { state, events };
  }

  // Lifesteal on attacker
  if (source) {
    for (const instance of source.tags) {
      const def = input.registry.getTag(instance.tagDefinitionId);
      if (!def) continue;
      for (const behavior of def.behaviors) {
        if (behavior.type !== 'lifesteal') continue;
        const effectCtx = createEffectContext({
          source,
          target,
          battle: state,
          registry: input.registry,
          combatStats: input.combatStats,
          rng: input.rng,
          skill: input.skill,
          tag: def,
          tagInstance: instance,
        });
        const percent = evaluateFormula(behavior.percent, effectCtx, instance) * instance.stacks;
        const healAmount = Math.floor(input.hpDamage * percent);
        if (healAmount <= 0) continue;

        const healed = withHp(source, Math.min(source.maxHp, source.hp + healAmount));
        state = {
          ...state,
          combatants: updateMap(state.combatants, source.id, healed),
        };
        events.push({
          type: 'heal_applied',
          sourceId: source.id,
          targetId: source.id,
          amount: healAmount,
          reason: 'tag',
          skillId: input.skill?.id,
        });
      }
    }
  }

  const liveTarget = getCombatant(state, input.targetId)!;

  for (const instance of liveTarget.tags) {
    const def = input.registry.getTag(instance.tagDefinitionId);
    if (!def) continue;

    for (const behavior of def.behaviors) {
      const effectCtx = createEffectContext({
        source: source ?? liveTarget,
        target: liveTarget,
        battle: state,
        registry: input.registry,
        combatStats: input.combatStats,
        rng: input.rng,
        skill: input.skill,
        tag: def,
        tagInstance: instance,
      });

      if (behavior.type === 'absorb') {
        const percent = evaluateFormula(behavior.percent, effectCtx, instance) * instance.stacks;
        const healAmount = Math.floor(input.hpDamage * percent);
        if (healAmount <= 0) continue;

        const current = getCombatant(state, liveTarget.id)!;
        const healed = withHp(current, Math.min(current.maxHp, current.hp + healAmount));
        state = {
          ...state,
          combatants: updateMap(state.combatants, liveTarget.id, healed),
        };
        events.push({
          type: 'heal_applied',
          sourceId: instance.sourceId,
          targetId: liveTarget.id,
          amount: healAmount,
          reason: 'tag',
          skillId: input.skill?.id,
        });
      }

      if (behavior.type === 'reflect' && source) {
        const percent = evaluateFormula(behavior.percent, effectCtx, instance) * instance.stacks;
        const reflectDamage = Math.floor(input.hpDamage * percent);
        if (reflectDamage <= 0) continue;

        const liveSource = getCombatant(state, source.id);
        if (!liveSource) continue;

        const result = applyIncomingDamage(liveSource, reflectDamage, false);
        state = {
          ...state,
          combatants: updateMap(state.combatants, source.id, result.combatant),
        };
        if (result.hpDamage > 0) {
          events.push({
            type: 'damage_dealt',
            sourceId: liveTarget.id,
            targetId: source.id,
            amount: result.hpDamage,
            reason: 'tag',
            tagId: instance.tagDefinitionId,
          });
        }
      }
    }
  }

  return { state, events };
}
