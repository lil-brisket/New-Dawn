import type { Combatant, BattleConfig } from '@dawn/types';

export function restoreResources(combatant: Combatant, config: BattleConfig): Combatant {
  return { ...combatant, ap: Math.min(combatant.maxAp, config.defaultMaxAp) };
}
