import type { DefinitionRegistry } from '@dawn/game-data';
import type { BattleError, BattleEvent, SkillAction, SkillSimulation } from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { calculateSkill } from './calculate';
import { validateSkill } from './validate';
import type { SkillTargetSelection } from './targeting';

export type SimulateSkillResult =
  SkillSimulation | { readonly ok: false; readonly error: BattleError };

function buildSimulation(events: readonly BattleEvent[]): Omit<SkillSimulation, 'ok'> {
  const damage = new Map<string, number>();
  const healing = new Map<string, number>();
  const statuses: { targetId: string; statusId: string }[] = [];
  let movement: SkillSimulation['movement'];

  for (const event of events) {
    switch (event.type) {
      case 'damage_dealt': {
        const prev = damage.get(event.targetId) ?? 0;
        damage.set(event.targetId, prev + event.amount);
        break;
      }
      case 'heal_applied': {
        const prev = healing.get(event.targetId) ?? 0;
        healing.set(event.targetId, prev + event.amount);
        break;
      }
      case 'status_applied':
        statuses.push({ targetId: event.targetId, statusId: event.statusId });
        break;
      case 'combatant_moved':
        movement = { from: event.from, to: event.to };
        break;
      default:
        break;
    }
  }

  return { damage, healing, statuses, movement, events };
}

export function simulateSkill(
  state: Parameters<typeof validateSkill>[0],
  action: SkillAction,
  registry: DefinitionRegistry = defaultRegistry,
): SimulateSkillResult {
  const validation = validateSkill(state, action, registry);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const calculated = calculateSkill(state, action, registry);
  return { ok: true, ...buildSimulation(calculated.events) };
}

export function preview(
  state: Parameters<typeof validateSkill>[0],
  skillId: string,
  sourceId: string,
  selection: SkillTargetSelection,
  registry: DefinitionRegistry = defaultRegistry,
): SimulateSkillResult {
  return simulateSkill(
    state,
    {
      type: 'skill',
      combatantId: sourceId,
      skillId,
      targetId: selection.targetId,
      destination: selection.destination,
    },
    registry,
  );
}
