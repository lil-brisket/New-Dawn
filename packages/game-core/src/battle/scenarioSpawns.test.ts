import { describe, expect, it } from 'vitest';
import { createBattle, createGrid, cubeToOffset, offsetToCube } from '../index';
import { contains, getTile } from '../grid/GridOps';
import { coordToKey } from '../utils/coordKey';
import { createCombatant } from '../entities/Combatant';

function knight(id: string, position: ReturnType<typeof offsetToCube>) {
  return createCombatant({
    id,
    name: id,
    team: 'player',
    position,
    hp: 100,
    maxHp: 100,
    sp: 50,
    maxSp: 50,
    attack: 20,
    defense: 5,
    movement: 3,
    ap: 30,
    maxAp: 30,
  });
}

function goblin(id: string, position: ReturnType<typeof offsetToCube>) {
  return createCombatant({
    id,
    name: id,
    team: 'enemy',
    position,
    hp: 40,
    maxHp: 40,
    sp: 20,
    maxSp: 20,
    attack: 12,
    defense: 2,
    movement: 3,
    ap: 30,
    maxAp: 30,
  });
}

const SCENARIOS = [
  {
    id: 'training',
    build: () => ({
      grid: createGrid({ width: 8, height: 8 }),
      party: [knight('knight-1', offsetToCube(1, 3))],
      enemies: [goblin('goblin-1', offsetToCube(6, 3))],
    }),
  },
  {
    id: 'duel',
    build: () => ({
      grid: createGrid({ width: 10, height: 8 }),
      party: [knight('knight-1', offsetToCube(1, 3)), knight('knight-2', offsetToCube(2, 3))],
      enemies: [goblin('goblin-1', offsetToCube(7, 3)), goblin('goblin-2', offsetToCube(8, 3))],
    }),
  },
  {
    id: 'arena',
    build: () => ({
      grid: createGrid({ width: 12, height: 10 }),
      party: [
        knight('hero-1', offsetToCube(1, 3)),
        knight('hero-2', offsetToCube(2, 3)),
        knight('hero-3', offsetToCube(1, 4)),
      ],
      enemies: [
        goblin('goblin-1', offsetToCube(9, 3)),
        goblin('goblin-2', offsetToCube(10, 3)),
        goblin('goblin-3', offsetToCube(9, 4)),
      ],
    }),
  },
] as const;

describe('sandbox scenario spawns', () => {
  for (const scenario of SCENARIOS) {
    it(`${scenario.id} starts with unique in-bounds walkable tiles`, () => {
      const input = scenario.build();
      const result = createBattle(input);
      expect(result.ok).toBe(true);
      if (!result.ok) return;

      const occupied = new Set<string>();
      for (const combatant of result.state.combatants.values()) {
        expect(contains(input.grid, combatant.position)).toBe(true);
        expect(getTile(input.grid, combatant.position)?.walkable).toBe(true);

        const key = coordToKey(combatant.position);
        expect(occupied.has(key)).toBe(false);
        occupied.add(key);
      }
    });

    it(`${scenario.id} places players west of enemies`, () => {
      const result = createBattle(scenario.build());
      expect(result.ok).toBe(true);
      if (!result.ok) return;

      const players = [...result.state.combatants.values()].filter((c) => c.team === 'player');
      const enemies = [...result.state.combatants.values()].filter((c) => c.team === 'enemy');

      for (const player of players) {
        for (const enemy of enemies) {
          expect(cubeToOffset(player.position).col).toBeLessThan(cubeToOffset(enemy.position).col);
        }
      }
    });
  }
});
