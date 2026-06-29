import type { SkillDefinition } from '@dawn/types';

export const slash: SkillDefinition = {
  id: 'skill_slash',
  name: 'Slash',
  description: 'A swift physical strike.',
  mpCost: 0,
  cooldown: 0,
  effects: [{ type: 'damage', element: 'physical', multiplier: 1.0 }],
  targeting: { type: 'single_enemy', range: 1 },
  animationKey: 'anim_slash',
  soundKey: 'sfx_slash',
};

export const fireball: SkillDefinition = {
  id: 'skill_fireball',
  name: 'Fireball',
  description: 'Hurls a ball of flame at a distant foe.',
  mpCost: 25,
  cooldown: 2,
  effects: [
    { type: 'damage', element: 'fire', multiplier: 1.4 },
    { type: 'apply_status', statusId: 'status_burn', chance: 0.3 },
  ],
  targeting: { type: 'single_enemy', range: 3 },
  animationKey: 'anim_fireball',
  soundKey: 'sfx_fireball',
};

export const shieldBash: SkillDefinition = {
  id: 'skill_shield_bash',
  name: 'Shield Bash',
  description: 'Stuns the target with a heavy shield strike.',
  mpCost: 15,
  cooldown: 3,
  effects: [
    { type: 'damage', element: 'physical', multiplier: 0.8 },
    { type: 'apply_status', statusId: 'status_stun', chance: 0.5 },
  ],
  targeting: { type: 'single_enemy', range: 1 },
  animationKey: 'anim_shield_bash',
  soundKey: 'sfx_shield_bash',
};
