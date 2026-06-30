import type { CreateBattleInput } from '@dawn/game-core';
import { createBattle, createGrid } from '@dawn/game-core';
import { createGoblin, createKnight } from './units';
import { getBattleScene, type BattleScene } from './scenes';
import { enemyLine, enemyWedge, gridTile, playerLine, playerWedge } from './spawns';

export interface BattleDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly difficulty: 'easy' | 'medium' | 'hard';
  readonly tags: readonly string[];
  readonly defaultEnemyStrategy: string;
  readonly sceneId: string;
  readonly build: () => CreateBattleInput;
}

export interface BattleScenario {
  readonly definition: BattleDefinition;
  readonly scene: BattleScene;
}

function scenario(def: BattleDefinition): BattleScenario {
  return {
    definition: def,
    scene: getBattleScene(def.sceneId),
  };
}

const DEFINITIONS: readonly BattleDefinition[] = [
  {
    id: 'training',
    name: 'Training',
    description: '1 Knight vs 1 Goblin — learn the basics',
    difficulty: 'easy',
    tags: ['1v1', 'movement', 'regression'],
    defaultEnemyStrategy: 'nearest_enemy',
    sceneId: 'training_field',
    build: () => {
      const grid = createGrid({ width: 8, height: 8 });
      const [playerSpawn, enemySpawn] = [gridTile(1, 3), gridTile(6, 3)];
      return {
        party: [createKnight('knight-1', playerSpawn)],
        enemies: [createGoblin('goblin-1', enemySpawn)],
        grid,
      };
    },
  },
  {
    id: 'duel',
    name: 'Duel',
    description: '2 Knights vs 2 Goblins',
    difficulty: 'medium',
    tags: ['2v2', 'movement'],
    defaultEnemyStrategy: 'nearest_enemy',
    sceneId: 'duel_arena',
    build: () => {
      const grid = createGrid({ width: 10, height: 8 });
      const [p1, p2] = playerLine(2, 1, 3);
      const [e1, e2] = enemyLine(2, 8, 3);
      return {
        party: [createKnight('knight-1', p1), createKnight('knight-2', p2)],
        enemies: [createGoblin('goblin-1', e1), createGoblin('goblin-2', e2)],
        grid,
      };
    },
  },
  {
    id: 'arena',
    name: 'Arena',
    description: '3 Heroes vs 3 Goblins',
    difficulty: 'hard',
    tags: ['3v3', 'movement'],
    defaultEnemyStrategy: 'nearest_enemy',
    sceneId: 'grand_arena',
    build: () => {
      const grid = createGrid({ width: 12, height: 10 });
      const [h1, h2, h3] = playerWedge([1, 2, 1], [3, 3, 4]);
      const [g1, g2, g3] = enemyWedge([9, 10, 9], [3, 3, 4]);
      return {
        party: [
          createKnight('hero-1', h1, { name: 'Hero 1' }),
          createKnight('hero-2', h2, { name: 'Hero 2' }),
          createKnight('hero-3', h3, { name: 'Hero 3' }),
        ],
        enemies: [
          createGoblin('goblin-1', g1),
          createGoblin('goblin-2', g2),
          createGoblin('goblin-3', g3),
        ],
        grid,
      };
    },
  },
];

export const BATTLE_SCENARIOS: readonly BattleScenario[] = DEFINITIONS.map(scenario);
export const BATTLE_DEFINITIONS = DEFINITIONS;

export function getBattleDefinition(id: string): BattleDefinition | undefined {
  return DEFINITIONS.find((b) => b.id === id);
}

export function getBattleScenario(id: string): BattleScenario | undefined {
  const def = getBattleDefinition(id);
  return def ? scenario(def) : undefined;
}

export function getBattlesByTag(tag: string): BattleDefinition[] {
  return DEFINITIONS.filter((b) => b.tags.includes(tag));
}

export function startBattle(def: BattleDefinition) {
  return createBattle(def.build());
}
