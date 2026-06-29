import type { EnemyDefinition } from '@dawn/types';

export const goblin: EnemyDefinition = {
  id: 'enemy_goblin',
  name: 'Goblin',
  description: 'A mischievous forest goblin.',
  portraitId: 'portrait_goblin',
  baseStats: {
    hp: 400,
    maxHp: 400,
    mp: 50,
    maxMp: 50,
    attack: 35,
    defense: 15,
    speed: 55,
    critRate: 0.05,
    critDamage: 1.2,
  },
  skillIds: ['skill_slash'],
  aiProfileId: 'ai_aggressive',
  lootTableId: 'loot_goblin',
  element: 'earth',
};

export const goblinChief: EnemyDefinition = {
  id: 'enemy_goblin_chief',
  name: 'Goblin Chief',
  description: 'Leader of the goblin warband.',
  portraitId: 'portrait_goblin_chief',
  baseStats: {
    hp: 1200,
    maxHp: 1200,
    mp: 100,
    maxMp: 100,
    attack: 55,
    defense: 35,
    speed: 45,
    critRate: 0.1,
    critDamage: 1.4,
  },
  skillIds: ['skill_slash', 'skill_shield_bash'],
  aiProfileId: 'ai_tactical',
  lootTableId: 'loot_goblin_chief',
  element: 'earth',
};
