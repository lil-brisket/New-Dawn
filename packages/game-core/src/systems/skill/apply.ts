import type { SkillAction, BattleEvent, BattleState } from '@dawn/types';
import { withCooldown, withSp } from '../../entities/Combatant';
import { getCombatant } from '../../queries/getActiveCombatant';
import { updateMap } from '../../utils/immutable';
import type { SkillCalculation } from './calculate';

export interface SkillApplyResult {
  readonly state: BattleState;
  readonly events: readonly BattleEvent[];
}

export function applySkill(
  state: BattleState,
  action: SkillAction,
  calculated: SkillCalculation,
): SkillApplyResult {
  const originalSource = getCombatant(state, action.combatantId)!;
  let combatants = calculated.state.combatants;

  const resolvedSource = combatants.get(action.combatantId) ?? originalSource;
  let updatedSource = withSp(resolvedSource, originalSource.sp - calculated.spCost);

  if (calculated.cooldown > 0) {
    updatedSource = withCooldown(updatedSource, calculated.skillId, calculated.cooldown);
  }

  combatants = updateMap(combatants, action.combatantId, updatedSource);

  const newState: BattleState = {
    ...state,
    combatants,
    turnActionState: {
      movesUsed: state.turnActionState.movesUsed,
      hasUsedPrimaryAction: true,
      apSpent: state.turnActionState.apSpent,
    },
  };

  return { state: newState, events: calculated.events };
}
