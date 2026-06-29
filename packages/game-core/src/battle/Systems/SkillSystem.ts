import type { BattleCommand, BattleState } from '@dawn/types';
import { resolveSkillEffects } from '../../skills/SkillResolver';
import type { System, SystemContext } from './System';

export class SkillSystem implements System {
  readonly name = 'SkillSystem';

  canHandle(command: BattleCommand): boolean {
    return command.type === 'skill';
  }

  execute(state: BattleState, command: BattleCommand, ctx: SystemContext): void {
    if (command.type !== 'skill') return;

    const actor = state.entities[command.actorId];
    if (!actor) return;

    const skill = ctx.engine.definitions.getSkill(command.skillId);
    if (!skill) return;

    if (actor.stats.mp < skill.mpCost) return;
    actor.stats.mp -= skill.mpCost;

    ctx.eventBus.emit({
      type: 'skill_used',
      actorId: actor.id,
      skillId: skill.id,
      targetIds: command.targetIds,
      animationKey: skill.animationKey,
      soundKey: skill.soundKey,
    });

    resolveSkillEffects(state, actor.id, command.targetIds, skill.effects, ctx);

    ctx.battleLog.append({
      actorId: actor.id,
      targetIds: command.targetIds,
      command,
      animationKey: skill.animationKey,
      soundKey: skill.soundKey,
    });
  }
}
