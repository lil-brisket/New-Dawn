import type { SkillEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { resolveApplyTagEffect } from './applyTag';

export function resolveEffect(effect: SkillEffect, ctx: AbilityContext): void {
  if (effect.type === 'apply_tag') {
    resolveApplyTagEffect(effect, ctx);
  }
}

export { resolveChargeSkill } from './charge';
// resolveChargeSkill is the charge movement resolver for skill_charge
