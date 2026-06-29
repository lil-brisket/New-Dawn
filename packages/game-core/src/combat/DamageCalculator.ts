import type { DamageResult } from '@dawn/types';
import type { RandomSource } from '@dawn/utils';
import { BATTLE_CONSTANTS } from '../constants/BattleConstants';

export interface DamageInput {
  sourceId: string;
  targetId: string;
  attack: number;
  defense: number;
  multiplier: number;
  critRate: number;
  critDamage: number;
}

export function calculateDamage(input: DamageInput, random: RandomSource): DamageResult {
  const rawDamage = input.attack * input.multiplier;
  const isCritical = random.chance(input.critRate);
  const critMultiplier = isCritical ? input.critDamage : 1;
  const afterCrit = rawDamage * critMultiplier;
  const mitigated = Math.max(1, afterCrit - input.defense * 0.5);
  const finalDamage = Math.floor(mitigated);

  return {
    sourceId: input.sourceId,
    targetId: input.targetId,
    rawDamage: Math.floor(rawDamage),
    finalDamage,
    isCritical,
    blocked: false,
  };
}

export { BATTLE_CONSTANTS };
