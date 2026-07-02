import type { BattleEvent, BattleState } from '@dawn/types';
import { defaultRegistry } from '@dawn/game-data';
import { createCombatant, withCooldowns, withSp } from '../entities/Combatant';
import { withHp } from '../entities/Combatant';
import { getCombatant } from '../queries/getActiveCombatant';
import { updateMap } from '../utils/immutable';
import { applyTag } from '../systems/tag/applyTag';
import { getBattleRng } from '../utils/battleRng';
import { createHex } from '../grid/Grid';
import { dispatchAction } from '../battle/dispatchAction';
import { applyVictory, checkVictory } from '../systems/victory/checkVictory';

export type SandboxResult =
  | { readonly ok: true; readonly state: BattleState; readonly events: readonly BattleEvent[] }
  | { readonly ok: false; readonly error: string };

function applyVictoryIfNeeded(state: BattleState): SandboxResult {
  const victory = checkVictory(state);
  if (victory === null) {
    return { ok: true, state, events: [] };
  }
  const result = applyVictory(state, victory);
  return { ok: true, state: result.state, events: [...result.events] };
}

export function sandboxForceKill(state: BattleState, combatantId: string): SandboxResult {
  if (state.winner !== null) {
    return { ok: false, error: 'BattleOver' };
  }

  const combatant = state.combatants.get(combatantId);
  if (!combatant) {
    return { ok: false, error: 'CombatantNotFound' };
  }

  const killed = withHp(combatant, 0);
  const nextState: BattleState = {
    ...state,
    combatants: updateMap(state.combatants, combatantId, killed),
  };

  return applyVictoryIfNeeded(nextState);
}

export function sandboxForceHeal(
  state: BattleState,
  combatantId: string,
  hp?: number,
): SandboxResult {
  const combatant = state.combatants.get(combatantId);
  if (!combatant) {
    return { ok: false, error: 'CombatantNotFound' };
  }

  const healed = withHp(combatant, hp ?? combatant.maxHp);
  const nextState: BattleState = {
    ...state,
    combatants: updateMap(state.combatants, combatantId, healed),
    winner: state.winner !== null && healed.hp > 0 ? null : state.winner,
  };

  return { ok: true, state: nextState, events: [] };
}

export function sandboxSetSp(state: BattleState, combatantId: string): SandboxResult {
  const combatant = state.combatants.get(combatantId);
  if (!combatant) {
    return { ok: false, error: 'CombatantNotFound' };
  }

  const updated = withSp(combatant, combatant.maxSp);
  return {
    ok: true,
    state: { ...state, combatants: updateMap(state.combatants, combatantId, updated) },
    events: [],
  };
}

export function sandboxClearCooldowns(state: BattleState, combatantId: string): SandboxResult {
  const combatant = state.combatants.get(combatantId);
  if (!combatant) {
    return { ok: false, error: 'CombatantNotFound' };
  }

  const updated = withCooldowns(combatant, {});
  return {
    ok: true,
    state: { ...state, combatants: updateMap(state.combatants, combatantId, updated) },
    events: [],
  };
}

export function sandboxApplyAllTags(state: BattleState, combatantId: string): SandboxResult {
  const combatant = getCombatant(state, combatantId);
  if (!combatant) {
    return { ok: false, error: 'CombatantNotFound' };
  }

  let current = state;
  const events: BattleEvent[] = [];
  const rng = getBattleRng(state);

  for (const tagDef of [
    defaultRegistry.getTag('tag_burn'),
    defaultRegistry.getTag('tag_stun'),
    defaultRegistry.getTag('tag_poison'),
    defaultRegistry.getTag('tag_attack_up'),
    defaultRegistry.getTag('tag_defense_up'),
  ]) {
    if (!tagDef) continue;
    const result = applyTag({
      state: current,
      sourceId: combatantId,
      targetId: combatantId,
      tagId: tagDef.id,
      chance: 1,
      registry: defaultRegistry,
      rng,
    });
    current = result.state;
    events.push(...result.events);
  }

  return { ok: true, state: current, events };
}

/** @deprecated Use sandboxApplyAllTags */
export const sandboxApplyAllStatuses = sandboxApplyAllTags;

export function sandboxSpawnDummy(
  state: BattleState,
  position: { x: number; y: number; z: number },
): SandboxResult {
  const coord = createHex(position.x, position.y);
  const id = `dummy-${state.combatants.size}`;
  const dummy = createCombatant({
    id,
    name: 'Dummy',
    team: 'enemy',
    position: coord,
    hp: 500,
    maxHp: 500,
    sp: 0,
    maxSp: 0,
    attack: 1,
    defense: 2,
    movement: 0,
    ap: 0,
    maxAp: 0,
    skillIds: [],
  });

  return {
    ok: true,
    state: {
      ...state,
      combatants: updateMap(state.combatants, id, dummy),
      turnOrder: [...state.turnOrder, id],
    },
    events: [],
  };
}

export function sandboxAdvanceTurns(state: BattleState, count: number): SandboxResult {
  if (count <= 0) {
    return { ok: true, state, events: [] };
  }

  let current = state;
  const events: BattleEvent[] = [];

  for (let i = 0; i < count; i++) {
    if (current.winner !== null) break;
    const activeId = current.activeCombatantId;
    if (!activeId) break;

    const result = dispatchAction(current, { type: 'end_turn', combatantId: activeId });
    if (!result.ok) {
      return { ok: false, error: result.error.code };
    }
    current = result.state;
    events.push(...result.events);
  }

  return { ok: true, state: current, events };
}

export function sandboxSkipRound(state: BattleState): SandboxResult {
  if (state.winner !== null) {
    return { ok: false, error: 'BattleOver' };
  }

  const startRound = state.round;
  let current = state;
  const events: BattleEvent[] = [];
  let safety = state.turnOrder.length + 1;

  while (safety > 0 && current.winner === null && current.round === startRound) {
    const activeId = current.activeCombatantId;
    if (!activeId) break;

    const result = dispatchAction(current, { type: 'end_turn', combatantId: activeId });
    if (!result.ok) {
      return { ok: false, error: result.error.code };
    }
    current = result.state;
    events.push(...result.events);
    safety--;
  }

  return { ok: true, state: current, events };
}
