import type { BuffEffect } from '@dawn/types';
import type { AbilityContext } from '../AbilityContext';
import { applyStatus } from '../../status/applyStatus';

export function resolveStatusEffect(effect: BuffEffect, ctx: AbilityContext): void {
  for (const target of ctx.targets) {
    const result = applyStatus({
      state: ctx.battle,
      sourceId: ctx.source.id,
      targetId: target.id,
      statusId: effect.statusId,
      chance: effect.chance,
      durationOverride: effect.duration,
      registry: ctx.registry,
      rng: ctx.rng,
    });
    ctx.battle = result.state;
    ctx.events.push(...result.events);
  }
}
