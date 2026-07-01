import type { SkillEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { resolveDamageEffect } from './damage';
import { resolveHealEffect } from './heal';
import { resolveStatusEffect } from './status';
import { resolveMoveEffect } from './move';
import { resolveTeleportEffect } from './teleport';
import { resolveShieldEffect } from './shield';
import { resolveChargeEffect } from './charge';

export function resolveEffect(effect: SkillEffect, ctx: AbilityContext): void {
  switch (effect.type) {
    case 'damage':
      resolveDamageEffect(effect, ctx);
      break;
    case 'heal':
      resolveHealEffect(effect, ctx);
      break;
    case 'apply_status':
      resolveStatusEffect(effect, ctx);
      break;
    case 'move':
      resolveMoveEffect(effect, ctx);
      break;
    case 'teleport':
      resolveTeleportEffect(effect, ctx);
      break;
    case 'summon':
      break;
    case 'shield':
      resolveShieldEffect(effect, ctx);
      break;
    default: {
      const _exhaustive: never = effect;
      void _exhaustive;
    }
  }
}

export function resolveChargeSkill(ctx: AbilityContext, targetId: string): void {
  resolveChargeEffect(ctx, targetId);
}
