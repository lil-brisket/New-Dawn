import type { BattleEvent, Combatant } from '@dawn/types';
import { clearShield, withHp, withShield } from '../../entities/Combatant';
import { isCombatantAlive } from '../../queries/isCombatantAlive';

export interface DamageApplicationResult {
  readonly combatant: Combatant;
  readonly hpDamage: number;
  readonly shieldDamage: number;
  readonly shieldsBroken: boolean;
}

/** Apply incoming damage — shields absorb first unless pierce breaks them. */
export function applyIncomingDamage(
  target: Combatant,
  rawDamage: number,
  pierce = false,
): DamageApplicationResult {
  if (rawDamage <= 0) {
    return { combatant: target, hpDamage: 0, shieldDamage: 0, shieldsBroken: false };
  }

  let combatant = target;
  let remaining = rawDamage;
  let shieldDamage = 0;
  let shieldsBroken = false;

  if (pierce && (combatant.shieldHp ?? 0) > 0) {
    combatant = clearShield(combatant);
    shieldsBroken = true;
  }

  const currentShield = combatant.shieldHp ?? 0;
  if (!pierce && currentShield > 0) {
    shieldDamage = Math.min(currentShield, remaining);
    remaining -= shieldDamage;
    combatant = withShield(combatant, currentShield - shieldDamage, combatant.shieldTurns ?? 0);
    if ((combatant.shieldHp ?? 0) <= 0) {
      combatant = clearShield(combatant);
    }
  }

  const hpDamage = remaining;
  if (hpDamage > 0) {
    combatant = withHp(combatant, combatant.hp - hpDamage);
  }

  return { combatant, hpDamage, shieldDamage, shieldsBroken };
}

export function isAliveAfterDamage(combatant: Combatant): boolean {
  return isCombatantAlive(combatant);
}

export function shieldAbsorbedEvent(
  targetId: string,
  amount: number,
  sourceId: string,
): BattleEvent {
  return {
    type: 'damage_dealt',
    sourceId,
    targetId,
    amount,
    reason: 'shield',
  };
}
