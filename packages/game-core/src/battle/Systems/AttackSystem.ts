import type { BattleCommand, BattleState } from '@dawn/types';
import { calculateDamage } from '../../combat/DamageCalculator';
import type { System, SystemContext } from './System';

export class AttackSystem implements System {
  readonly name = 'AttackSystem';

  canHandle(command: BattleCommand): boolean {
    return command.type === 'attack';
  }

  execute(state: BattleState, command: BattleCommand, ctx: SystemContext): void {
    if (command.type !== 'attack') return;

    const actor = state.entities[command.actorId];
    const target = state.entities[command.targetId];
    if (!actor || !target) return;

    const result = calculateDamage(
      {
        sourceId: actor.id,
        targetId: target.id,
        attack: actor.stats.attack,
        defense: target.stats.defense,
        multiplier: 1.0,
        critRate: actor.stats.critRate,
        critDamage: actor.stats.critDamage,
      },
      ctx.engine.random,
    );

    target.stats.hp = Math.max(0, target.stats.hp - result.finalDamage);
    if (target.stats.hp <= 0) {
      target.isAlive = false;
    }

    ctx.eventBus.emit({
      type: 'damage_taken',
      sourceId: actor.id,
      targetId: target.id,
      amount: result.finalDamage,
      isCritical: result.isCritical,
      animationKey: 'anim_attack',
      soundKey: 'sfx_hit',
    });

    ctx.battleLog.append({
      actorId: actor.id,
      targetIds: [target.id],
      command,
      damage: result.finalDamage,
      isCritical: result.isCritical,
      animationKey: 'anim_attack',
      soundKey: 'sfx_hit',
    });
  }
}
