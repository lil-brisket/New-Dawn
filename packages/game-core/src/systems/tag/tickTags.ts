import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState, TagInstance } from '@dawn/types';
import { withTags } from '../../entities/Combatant';
import { applyIncomingDamage } from '../combat/resolveIncomingDamage';
import { getCombatant } from '../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../queries/isCombatantAlive';
import { updateMap } from '../../utils/immutable';
import { createEffectContext } from '../scaling/EffectContext';
import { evaluateFormula } from '../scaling/getEffectiveStat';
import { tagHookDispatcher } from './hooks/dispatcher';
import { processDamageModifiers } from './damageModifiers';

const noopRng = {
  chance: () => true,
  next: () => 0.5,
  nextInt: (min: number) => min,
};

export interface TagTickResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

export function tickTags(
  state: BattleState,
  combatantId: string,
  registry: DefinitionRegistry,
): TagTickResult {
  const combatant = getCombatant(state, combatantId);
  if (!combatant || combatant.tags.length === 0) {
    return { state, events: [] };
  }

  const events: BattleEvent[] = [];
  let current = combatant;
  const combatStats = registry.getCombatStatsConfig();

  for (const instance of combatant.tags) {
    const def = registry.getTag(instance.tagDefinitionId);
    if (!def) continue;

    for (const behavior of def.behaviors) {
      if (behavior.type !== 'dot') continue;

      const source = getCombatant(state, instance.sourceId);
      const effectCtx = createEffectContext({
        source: source ?? current,
        target: current,
        battle: state,
        registry,
        combatStats,
        rng: noopRng,
        tag: def,
        tagInstance: instance,
      });

      const perStack = evaluateFormula(behavior.damagePerTurn, effectCtx, instance);
      const damage = perStack * instance.stacks;
      if (damage <= 0) continue;

      const result = applyIncomingDamage(current, damage, false);
      current = result.combatant;

      events.push({
        type: 'tag_tick',
        targetId: combatantId,
        tagId: instance.tagDefinitionId,
        damage: result.hpDamage + result.shieldDamage,
      });

      if (result.hpDamage > 0) {
        events.push({
          type: 'damage_dealt',
          sourceId: instance.sourceId,
          targetId: combatantId,
          amount: result.hpDamage,
          reason: 'tag',
          tagId: instance.tagDefinitionId,
          element: behavior.element,
        });

        const modResult = processDamageModifiers({
          state: { ...state, combatants: updateMap(state.combatants, combatantId, current) },
          sourceId: instance.sourceId,
          targetId: combatantId,
          hpDamage: result.hpDamage,
          registry,
          combatStats,
          rng: noopRng,
        });
        current = getCombatant(modResult.state, combatantId) ?? current;
        events.push(...modResult.events);
      }

      if (result.shieldDamage > 0) {
        events.push({
          type: 'damage_dealt',
          sourceId: instance.sourceId,
          targetId: combatantId,
          amount: result.shieldDamage,
          reason: 'shield',
          tagId: instance.tagDefinitionId,
        });
      }

      if (!isCombatantAlive(current)) {
        break;
      }
    }
  }

  if (current === combatant) {
    return { state, events };
  }

  return {
    state: {
      ...state,
      combatants: updateMap(state.combatants, combatantId, current),
    },
    events,
  };
}

/** @deprecated Use tickTags */
export const tickStatuses = tickTags;

export function decayTags(
  state: BattleState,
  combatantId: string,
  registry: DefinitionRegistry,
): TagTickResult {
  const combatant = getCombatant(state, combatantId);
  if (!combatant || combatant.tags.length === 0) {
    return { state, events: [] };
  }

  const events: BattleEvent[] = [];
  const remaining: TagInstance[] = [];
  const combatStats = registry.getCombatStatsConfig();

  for (const instance of combatant.tags) {
    const nextTurns = instance.remainingTurns - 1;
    if (nextTurns > 0) {
      remaining.push({ ...instance, remainingTurns: nextTurns });
    } else {
      const def = registry.getTag(instance.tagDefinitionId);
      const hookCtx = {
        source: getCombatant(state, instance.sourceId) ?? combatant,
        target: combatant,
        battle: state,
        registry,
        combatStats,
        rng: noopRng,
        tag: def,
        tagInstance: instance,
        instance,
        events: [] as BattleEvent[],
      };
      tagHookDispatcher.dispatch('onExpire', hookCtx);
      events.push(...hookCtx.events);
      events.push({
        type: 'tag_removed',
        targetId: combatantId,
        tagId: instance.tagDefinitionId,
      });
    }
  }

  if (remaining.length === combatant.tags.length) {
    const allSame = remaining.every(
      (r, i) => r.remainingTurns === combatant.tags[i]!.remainingTurns,
    );
    if (allSame) {
      return { state, events: [] };
    }
  }

  const updated = withTags(combatant, remaining);
  return {
    state: {
      ...state,
      combatants: updateMap(state.combatants, combatantId, updated),
    },
    events,
  };
}

/** @deprecated Use decayTags */
export const decayStatuses = decayTags;

export function decrementCooldowns(state: BattleState, combatantId: string): BattleState {
  const combatant = getCombatant(state, combatantId);
  if (!combatant) return state;

  const nextCooldowns: Record<string, number> = {};
  let changed = false;

  for (const [skillId, turns] of Object.entries(combatant.skillCooldowns)) {
    if (turns > 1) {
      nextCooldowns[skillId] = turns - 1;
      changed = true;
    } else if (turns === 1) {
      nextCooldowns[skillId] = 0;
      changed = true;
    }
  }

  if (!changed) return state;

  return {
    ...state,
    combatants: updateMap(state.combatants, combatantId, {
      ...combatant,
      skillCooldowns: nextCooldowns,
    }),
  };
}
