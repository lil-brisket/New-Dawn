import type { CreateBattleInput } from '@dawn/game-core';
import { createBattle, createGrid } from '@dawn/game-core';
import { createGoblin, createKnight, createSkillLabKnight, createSkillLabAlly } from './units';
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

const ALL_SKILL_IDS = [
  'skill_slash',
  'skill_fireball',
  'skill_shield_bash',
  'skill_mend',
  'skill_second_wind',
  'skill_war_cry',
  'skill_fortify',
  'skill_poison_dart',
  'skill_blink',
  'skill_charge',
  'skill_arcane_burst',
  'skill_meteor',
  'skill_healing_rain',
] as const;

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
      const playerSpawns = playerLine(2, 1, 3);
      const enemySpawns = enemyLine(2, 8, 3);
      return {
        party: [
          createKnight('knight-1', playerSpawns[0]!),
          createKnight('knight-2', playerSpawns[1]!),
        ],
        enemies: [
          createGoblin('goblin-1', enemySpawns[0]!),
          createGoblin('goblin-2', enemySpawns[1]!),
        ],
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
      const playerSpawns = playerWedge([1, 2, 1], [3, 3, 4]);
      const enemySpawns = enemyWedge([9, 10, 9], [3, 3, 4]);
      return {
        party: [
          createKnight('hero-1', playerSpawns[0]!, { name: 'Hero 1' }),
          createKnight('hero-2', playerSpawns[1]!, { name: 'Hero 2' }),
          createKnight('hero-3', playerSpawns[2]!, { name: 'Hero 3' }),
        ],
        enemies: [
          createGoblin('goblin-1', enemySpawns[0]!),
          createGoblin('goblin-2', enemySpawns[1]!),
          createGoblin('goblin-3', enemySpawns[2]!),
        ],
        grid,
      };
    },
  },
  {
    id: 'skill_lab',
    name: 'Skill Lab',
    description: 'Test all skills and tag effects',
    difficulty: 'easy',
    tags: ['skills', 'tag', 'regression'],
    defaultEnemyStrategy: 'passive',
    sceneId: 'training_field',
    build: () => {
      const grid = createGrid({ width: 10, height: 8 });
      return {
        party: [
          createSkillLabKnight('lab-knight', gridTile(2, 3), ALL_SKILL_IDS),
          createSkillLabAlly('lab-ally', gridTile(2, 5)),
        ],
        enemies: [
          createGoblin('dummy-1', gridTile(7, 4), {
            name: 'Training Dummy',
            hp: 500,
            maxHp: 500,
            attack: 1,
            defense: 2,
            sp: 0,
            maxSp: 0,
          }),
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
