import { describe, expect, it } from 'vitest';
import type { Combatant } from '@dawn/types';
import { createHex } from '../grid/HexCoord';
import { createGrid, offsetToCube } from '../grid/Grid';
import { createCombatant } from '../entities/Combatant';
import { createBattle } from '../battle/createBattle';
import { dispatchAction } from '../battle/dispatchAction';
import { DEFAULT_BATTLE_CONFIG } from '../rules/defaultRules';
import { isCombatantAlive } from '../queries/isCombatantAlive';

function makeCombatant(
  overrides: Partial<Combatant> & Pick<Combatant, 'id' | 'team' | 'position'>,
): Combatant {
  return createCombatant({
    name: overrides.id,
    hp: 100,
    maxHp: 100,
    sp: 50,
    maxSp: 50,
    attack: 20,
    defense: 5,
    movement: 3,
    ap: 30,
    maxAp: 30,
    ...overrides,
  });
}

describe('dispatchAction', () => {
  const grid = createGrid({ width: 8, height: 8 });

  function setupBattle() {
    const player = makeCombatant({
      id: 'player',
      team: 'player',
      position: createHex(0, 0),
    });
    const enemy = makeCombatant({
      id: 'e1',
      team: 'enemy',
      position: createHex(1, -1),
      hp: 20,
      attack: 15,
      defense: 5,
    });
    return createBattle({ player, enemies: [enemy], grid });
  }

  it('creates battle with turn order player then enemy', () => {
    const result = setupBattle();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.activeCombatantId).toBe('player');
    expect(result.state.playerId).toBe('player');
    expect(result.state.turnOrder).toEqual(['player', 'e1']);
  });

  it('moves combatant and emits CombatantMoved event', () => {
    const battle = setupBattle();
    expect(battle.ok).toBe(true);
    if (!battle.ok) return;

    const moveResult = dispatchAction(battle.state, {
      type: 'move',
      combatantId: 'player',
      destination: createHex(0, -1),
    });

    expect(moveResult.ok).toBe(true);
    if (!moveResult.ok) return;

    expect(moveResult.events.some((e) => e.type === 'combatant_moved')).toBe(true);
    expect(moveResult.state.combatants.get('player')?.position).toEqual(createHex(0, -1));
    expect(moveResult.state.history).toHaveLength(1);
  });

  it('rejects move on wrong turn', () => {
    const battle = setupBattle();
    if (!battle.ok) return;
    const result = dispatchAction(battle.state, {
      type: 'move',
      combatantId: 'e1',
      destination: createHex(2, -2),
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('WrongTurn');
  });

  it('attacks adjacent enemy and kills when hp reaches 0', () => {
    const player = makeCombatant({
      id: 'player',
      team: 'player',
      position: createHex(0, 0),
      attack: 25,
    });
    const enemy = makeCombatant({
      id: 'e1',
      team: 'enemy',
      position: createHex(1, -1),
      hp: 15,
      defense: 5,
    });
    const battle = createBattle({ player, enemies: [enemy], grid });
    if (!battle.ok) return;

    const attackResult = dispatchAction(battle.state, {
      type: 'attack',
      combatantId: 'player',
      targetId: 'e1',
    });

    expect(attackResult.ok).toBe(true);
    if (!attackResult.ok) return;

    const deadEnemy = attackResult.state.combatants.get('e1')!;
    expect(deadEnemy.hp).toBe(0);
    expect(isCombatantAlive(deadEnemy)).toBe(false);
    expect(attackResult.events.some((e) => e.type === 'damage_dealt')).toBe(true);
    expect(attackResult.events.some((e) => e.type === 'combatant_killed')).toBe(true);
    expect(attackResult.state.winner).toBe('player');
    expect(attackResult.events.some((e) => e.type === 'battle_won')).toBe(true);
  });

  it('rejects double attack per turn', () => {
    const player = makeCombatant({ id: 'player', team: 'player', position: createHex(0, 0) });
    const enemy = makeCombatant({
      id: 'e1',
      team: 'enemy',
      position: createHex(1, -1),
      hp: 100,
    });
    const battle = createBattle({ player, enemies: [enemy], grid });
    if (!battle.ok) return;

    const first = dispatchAction(battle.state, {
      type: 'attack',
      combatantId: 'player',
      targetId: 'e1',
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = dispatchAction(first.state, {
      type: 'attack',
      combatantId: 'player',
      targetId: 'e1',
    });
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error.code).toBe('AlreadyAttacked');
  });

  it('advances turn on end_turn', () => {
    const battle = setupBattle();
    if (!battle.ok) return;
    const result = dispatchAction(battle.state, { type: 'end_turn', combatantId: 'player' });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.state.activeCombatantId).toBe('e1');
    expect(result.events.some((e) => e.type === 'turn_ended')).toBe(true);
    expect(result.events.some((e) => e.type === 'turn_started')).toBe(true);
  });

  it('turn order is player then multiple enemies', () => {
    const player = makeCombatant({ id: 'player', team: 'player', position: createHex(0, 0) });
    const e1 = makeCombatant({ id: 'e1', team: 'enemy', position: createHex(3, -3) });
    const e2 = makeCombatant({ id: 'e2', team: 'enemy', position: createHex(4, -4) });
    const battle = createBattle({ player, enemies: [e1, e2], grid });
    if (!battle.ok) return;
    expect(battle.state.turnOrder).toEqual(['player', 'e1', 'e2']);
  });

  it('rejects invalid battle setup with no enemies', () => {
    const player = makeCombatant({ id: 'player', team: 'player', position: createHex(0, 0) });
    const result = createBattle({ player, enemies: [], grid });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('InvalidBattleSetup');
  });

  it('supports multi-unit party with correct turn order', () => {
    const p1 = makeCombatant({ id: 'p1', team: 'player', position: offsetToCube(0, 0) });
    const p2 = makeCombatant({ id: 'p2', team: 'player', position: offsetToCube(1, 0) });
    const e1 = makeCombatant({ id: 'e1', team: 'enemy', position: offsetToCube(5, 2) });
    const e2 = makeCombatant({ id: 'e2', team: 'enemy', position: offsetToCube(6, 3) });
    const battle = createBattle({ party: [p1, p2], enemies: [e1, e2], grid });
    if (!battle.ok) return;
    expect(battle.state.turnOrder).toEqual(['p1', 'p2', 'e1', 'e2']);
    expect(battle.state.playerId).toBe('p1');

    const endP1 = dispatchAction(battle.state, { type: 'end_turn', combatantId: 'p1' });
    if (!endP1.ok) return;
    expect(endP1.state.activeCombatantId).toBe('p2');

    const endP2 = dispatchAction(endP1.state, { type: 'end_turn', combatantId: 'p2' });
    if (!endP2.ok) return;
    expect(endP2.state.activeCombatantId).toBe('e1');
  });

  it('respects custom moveCost in config', () => {
    const player = makeCombatant({
      id: 'player',
      team: 'player',
      position: createHex(0, 0),
      ap: 10,
      maxAp: 10,
    });
    const enemy = makeCombatant({
      id: 'e1',
      team: 'enemy',
      position: createHex(5, -5),
    });
    const config = { ...DEFAULT_BATTLE_CONFIG, moveCost: 5, maxMoves: 10, defaultMaxAp: 10 };
    const battle = createBattle({ player, enemies: [enemy], grid, config });
    if (!battle.ok) return;

    const move1 = dispatchAction(battle.state, {
      type: 'move',
      combatantId: 'player',
      destination: createHex(0, -1),
    });
    expect(move1.ok).toBe(true);
    if (!move1.ok) return;
    expect(move1.state.combatants.get('player')?.ap).toBe(5);

    const move2 = dispatchAction(move1.state, {
      type: 'move',
      combatantId: 'player',
      destination: createHex(1, -1),
    });
    expect(move2.ok).toBe(true);
    if (!move2.ok) return;
    expect(move2.state.combatants.get('player')?.ap).toBe(0);

    const move3 = dispatchAction(move2.state, {
      type: 'move',
      combatantId: 'player',
      destination: createHex(1, -2),
    });
    expect(move3.ok).toBe(false);
    if (move3.ok) return;
    expect(move3.error.code).toBe('InsufficientAp');
  });
});
