import type {
  ApplicationFormula,
  CombatStatId,
  DurationFormula,
  TagBehaviorOverrides,
  HexCoord,
} from '@dawn/types';
import type { BattleEvent, BattleState } from '@dawn/types';
import { createId } from '@dawn/utils';
import { withTags } from '../../entities/Combatant';
import { getCombatant } from '../../queries/getActiveCombatant';
import { updateMap } from '../../utils/immutable';
import type { EffectContext } from '../scaling/EffectContext';
import {
  calculateApplicationChance,
  calculateDuration,
  createSourceSnapshots,
} from '../scaling/tagFormulas';
import { tagHookDispatcher } from './hooks/dispatcher';
import { mergeTagBehaviors, shouldPersistTag } from './mergeBehaviors';
import { executeTagBehaviors } from './executeBehaviors';
import { createAbilityContext } from '../skill/AbilityContext';

export interface TagApplicationInput {
  readonly ctx: EffectContext;
  readonly tagId: string;
  readonly baseChance: number;
  readonly baseDuration?: number;
  readonly durationFormula?: DurationFormula;
  readonly applicationFormula?: ApplicationFormula;
  readonly overrides?: TagBehaviorOverrides;
  readonly targetTile?: HexCoord;
}

export interface TagApplicationResult {
  readonly applied: boolean;
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

function checkImmunity(_ctx: EffectContext, _tagId: string): boolean {
  return false;
}

export function resolveTagApplication(input: TagApplicationInput): TagApplicationResult {
  const { ctx, tagId, baseChance, durationFormula, applicationFormula, overrides } = input;
  const definition = ctx.registry.getTag(tagId);
  if (!definition) {
    return { applied: false, state: ctx.battle, events: [] };
  }

  const target = getCombatant(ctx.battle, ctx.target.id);
  if (!target) {
    return { applied: false, state: ctx.battle, events: [] };
  }

  if (checkImmunity(ctx, tagId)) {
    return { applied: false, state: ctx.battle, events: [] };
  }

  const mergedBehaviors = mergeTagBehaviors(definition, overrides);
  const appFormula = applicationFormula ?? definition.applicationFormula;
  const finalChance = calculateApplicationChance(baseChance, ctx, appFormula);
  if (!ctx.rng.chance(finalChance)) {
    return { applied: false, state: ctx.battle, events: [] };
  }

  const baseDuration = input.baseDuration ?? definition.duration;
  const durFormula = durationFormula ?? definition.durationFormula;
  const duration = calculateDuration(baseDuration, ctx, durFormula);

  const hookCtx = {
    ...ctx,
    target,
    tag: definition,
    events: [] as BattleEvent[],
  };

  tagHookDispatcher.dispatch('onBeforeApply', hookCtx);

  const abilityCtx = createAbilityContext({
    battle: ctx.battle,
    source: ctx.source,
    targets: [target],
    targetTile: input.targetTile,
    skill: ctx.skill,
    registry: ctx.registry,
    rng: ctx.rng,
  });

  executeTagBehaviors(abilityCtx, mergedBehaviors, tagId);

  let state = abilityCtx.battle;
  const events: BattleEvent[] = [...hookCtx.events, ...abilityCtx.events];

  if (!shouldPersistTag(duration, mergedBehaviors)) {
    return { state, events, applied: true };
  }

  const statIds = ctx.combatStats.stats.map((s) => s.id) as CombatStatId[];
  const snapshots = createSourceSnapshots(ctx, statIds);
  const liveTarget = getCombatant(state, target.id)!;
  const existing = liveTarget.tags.find((s) => s.tagDefinitionId === tagId);
  let nextTags;
  let stacks: number;

  if (existing) {
    if (!definition.stackable) {
      nextTags = liveTarget.tags.map((s) =>
        s.tagDefinitionId === tagId
          ? { ...s, remainingTurns: duration, stacks: 1, sourceSnapshots: snapshots }
          : s,
      );
      stacks = 1;
    } else {
      const newStacks = Math.min(existing.stacks + 1, definition.maxStacks);
      nextTags = liveTarget.tags.map((s) =>
        s.tagDefinitionId === tagId
          ? { ...s, remainingTurns: duration, stacks: newStacks, sourceSnapshots: snapshots }
          : s,
      );
      stacks = newStacks;
    }
  } else {
    const instance = {
      id: createId('tag'),
      tagDefinitionId: tagId,
      sourceId: ctx.source.id,
      targetId: target.id,
      remainingTurns: duration,
      stacks: 1,
      sourceSnapshots: snapshots,
    };
    nextTags = [...liveTarget.tags, instance];
    stacks = 1;
  }

  const updated = withTags(liveTarget, nextTags);
  state = {
    ...state,
    combatants: updateMap(state.combatants, target.id, updated),
  };

  const instance = nextTags.find((s) => s.tagDefinitionId === tagId)!;
  tagHookDispatcher.dispatch('onApply', {
    ...hookCtx,
    tagInstance: instance,
    instance,
    target: updated,
  });

  events.push({
    type: 'tag_applied',
    sourceId: ctx.source.id,
    targetId: target.id,
    tagId,
    stacks,
  });

  return { state, events, applied: true };
}
