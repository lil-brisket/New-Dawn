import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleEvent, BattleState, SkillAction } from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { getCombatant } from '../../queries/getActiveCombatant';
import { cloneBattleState } from '../../utils/cloneBattle';
import { getBattleRng } from '../../utils/battleRng';
import { createAbilityContext } from './AbilityContext';
import { resolveEffect, resolveChargeSkill } from './effects';
import { resolveSkillTargets } from './targeting';
import { dispatchStatusTriggers } from '../status/dispatchTriggers';

export interface SkillCalculation {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
  readonly hpCost: number;
  readonly spCost: number;
  readonly apCost: number;
  readonly cooldown: number;
  readonly skillId: string;
}

export function calculateSkill(
  state: BattleState,
  action: SkillAction,
  registry: DefinitionRegistry = defaultRegistry,
): SkillCalculation {
  const skill = registry.getSkill(action.skillId)!;
  const source = getCombatant(state, action.combatantId)!;
  const workingState = cloneBattleState(state);
  const selection = { targetId: action.targetId, destination: action.destination };
  const { targets, targetTile } = resolveSkillTargets(
    workingState,
    skill,
    action.combatantId,
    selection,
  );

  const ctx = createAbilityContext({
    battle: workingState,
    source,
    targets,
    targetTile,
    skill,
    registry,
    rng: getBattleRng(state),
  });

  if (action.skillId === 'skill_charge' && action.targetId) {
    resolveChargeSkill(ctx, action.targetId);
    const refreshedSource = getCombatant(ctx.battle, action.combatantId);
    if (refreshedSource) {
      ctx.source = refreshedSource;
      const target = getCombatant(ctx.battle, action.targetId);
      if (target) {
        ctx.targets = [target];
      }
    }
  }

  for (const effect of skill.effects) {
    if (action.skillId === 'skill_charge' && effect.type === 'move') {
      continue;
    }
    resolveEffect(effect, ctx);
  }

  const attackTriggers = dispatchStatusTriggers(
    ctx.battle,
    action.combatantId,
    'on_attack',
    registry,
    getBattleRng(state),
  );
  ctx.battle = attackTriggers.state;
  ctx.events.push(...attackTriggers.events);

  const targetIds = targets.map((t) => t.id);
  ctx.events.unshift({
    type: 'skill_used',
    sourceId: action.combatantId,
    skillId: action.skillId,
    targetIds,
  });

  return {
    state: ctx.battle,
    events: ctx.events,
    hpCost: skill.hpCost,
    spCost: skill.spCost,
    apCost: skill.apCost,
    cooldown: skill.cooldown,
    skillId: action.skillId,
  };
}
