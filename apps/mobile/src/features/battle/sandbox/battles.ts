import type { CreateBattleInput } from '@dawn/game-core';
import { createBattle, createGrid, createHex } from '@dawn/game-core';
import { createGoblin, createKnight } from './units';
import { getBattleScene, type BattleScene } from './scenes';

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
    build: () => ({
      party: [createKnight('knight-1', createHex(0, 0))],
      enemies: [createGoblin('goblin-1', createHex(4, -4))],
      grid: createGrid({ width: 8, height: 8 }),
    }),
  },
  {
    id: 'duel',
    name: 'Duel',
    description: '2 Knights vs 2 Goblins',
    difficulty: 'medium',
    tags: ['2v2', 'movement'],
    defaultEnemyStrategy: 'nearest_enemy',
    sceneId: 'duel_arena',
    build: () => ({
      party: [createKnight('knight-1', createHex(0, 0)), createKnight('knight-2', createHex(1, 0))],
      enemies: [
        createGoblin('goblin-1', createHex(5, -5)),
        createGoblin('goblin-2', createHex(6, -5)),
      ],
      grid: createGrid({ width: 10, height: 8 }),
    }),
  },
  {
    id: 'arena',
    name: 'Arena',
    description: '3 Heroes vs 3 Goblins',
    difficulty: 'hard',
    tags: ['3v3', 'movement'],
    defaultEnemyStrategy: 'nearest_enemy',
    sceneId: 'grand_arena',
    build: () => ({
      party: [
        createKnight('hero-1', createHex(0, 0), { name: 'Hero 1' }),
        createKnight('hero-2', createHex(1, 0), { name: 'Hero 2' }),
        createKnight('hero-3', createHex(0, 1), { name: 'Hero 3' }),
      ],
      enemies: [
        createGoblin('goblin-1', createHex(6, -6)),
        createGoblin('goblin-2', createHex(7, -6)),
        createGoblin('goblin-3', createHex(6, -7)),
      ],
      grid: createGrid({ width: 12, height: 10 }),
    }),
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
