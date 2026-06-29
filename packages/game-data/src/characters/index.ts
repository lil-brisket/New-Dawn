import type { CharacterDefinition } from '@dawn/types';

export const heroAstra: CharacterDefinition = {
  id: 'char_astra',
  name: 'Astra',
  description: 'A swift blade dancer of the dawn order.',
  portraitId: 'portrait_astra',
  baseStats: {
    hp: 1200,
    maxHp: 1200,
    mp: 200,
    maxMp: 200,
    attack: 85,
    defense: 45,
    speed: 72,
    critRate: 0.15,
    critDamage: 1.5,
  },
  skillIds: ['skill_slash', 'skill_fireball'],
  element: 'light',
  rarity: 'epic',
};

export const heroKael: CharacterDefinition = {
  id: 'char_kael',
  name: 'Kael',
  description: 'A stalwart guardian wielding earth magic.',
  portraitId: 'portrait_kael',
  baseStats: {
    hp: 1800,
    maxHp: 1800,
    mp: 120,
    maxMp: 120,
    attack: 60,
    defense: 90,
    speed: 40,
    critRate: 0.05,
    critDamage: 1.3,
  },
  skillIds: ['skill_shield_bash'],
  element: 'earth',
  rarity: 'rare',
};
