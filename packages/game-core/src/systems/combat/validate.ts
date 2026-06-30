import type { AttackAction, BattleError, BattleState } from '@dawn/types';
import type { Result } from '@dawn/utils';
import { err, ok } from '@dawn/utils';
import { distance } from '../../grid/HexMath';
import { isEnemy } from '../../entities/Team';
import { getCombatant } from '../../queries/getActiveCombatant';
import { isCombatantAlive } from '../../queries/isCombatantAlive';

export function validateAttack(
  state: BattleState,
  action: AttackAction,
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

  if (state.turnActionState.hasAttacked) {
    return err({ code: 'AlreadyAttacked' });
  }

  const { config } = state;
  if (combatant.ap < config.attackCost) {
    return err({ code: 'InsufficientAp' });
  }

  const target = getCombatant(state, action.targetId);
  if (!target) {
    return err({ code: 'TargetNotFound' });
  }

  if (!isCombatantAlive(target)) {
    return err({ code: 'DeadCombatant' });
  }

  if (!isEnemy(combatant.team, target.team)) {
    return err({ code: 'CannotAttackAlly' });
  }

  const dist = distance(combatant.position, target.position);
  if (dist > config.attackRange) {
    return err({ code: 'NotAdjacent' });
  }

  return ok(undefined);
}
