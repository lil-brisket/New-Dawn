import type { SkillAction, BattleError, BattleState } from '@dawn/types';
import type { Result } from '@dawn/utils';
import { err, ok } from '@dawn/utils';
import { defaultRegistry, type DefinitionRegistry } from '@dawn/game-data';
import { getCombatant } from '../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../queries/isCombatantAlive';
import { isStunned } from '../status/hasControlEffect';
import { canTarget } from './targeting';

/** Minimum HP combatant must retain after paying an HP cost (self-sacrifice skills may override later). */
export const SKILL_MINIMUM_HP_AFTER_COST = 1;

function isSkillOnCooldown(
  combatant: { skillCooldowns: Readonly<Record<string, number>> },
  skillId: string,
  cooldown: number,
): boolean {
  if (cooldown <= 0) return false;
  const remaining = combatant.skillCooldowns[skillId];
  return remaining !== undefined && remaining > 0;
}

export function validateSkill(
  state: BattleState,
  action: SkillAction,
  registry: DefinitionRegistry = defaultRegistry,
): Result<void, BattleError> {
  if (state.winner !== null) {
    return err({ code: 'BattleOver' });
  }

  if (state.activeCombatantId !== action.combatantId) {
    return err({ code: 'WrongTurn' });
  }

  const combatant = getCombatant(state, action.combatantId);
  if (!combatant) {
    return err({ code: 'CombatantNotFound' });
  }

  if (!isCombatantAlive(combatant)) {
    return err({ code: 'DeadCombatant' });
  }

  if (isStunned(combatant, registry)) {
    return err({ code: 'Stunned' });
  }

  if (state.turnActionState.hasUsedPrimaryAction) {
    return err({ code: 'PrimaryActionUsed' });
  }

  const skill = registry.getSkill(action.skillId);
  if (!skill) {
    return err({ code: 'SkillNotFound' });
  }

  if (!combatant.skillIds.includes(action.skillId)) {
    return err({ code: 'SkillNotFound' });
  }

  if (combatant.sp < skill.spCost) {
    return err({ code: 'InsufficientSp' });
  }

  if (combatant.ap < skill.apCost) {
    return err({ code: 'InsufficientAp' });
  }

  if (skill.hpCost > 0 && combatant.hp - skill.hpCost < SKILL_MINIMUM_HP_AFTER_COST) {
    return err({ code: 'InsufficientHp' });
  }

  if (isSkillOnCooldown(combatant, action.skillId, skill.cooldown)) {
    return err({ code: 'SkillOnCooldown' });
  }

  const selection = { targetId: action.targetId, destination: action.destination };
  if (!canTarget(state, skill, action.combatantId, selection)) {
    return err({ code: 'InvalidSkillTarget' });
  }

  return ok(undefined);
}
