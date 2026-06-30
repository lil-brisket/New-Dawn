/** Animation priority contract for battle UI — queue implementation deferred */
export enum AnimationPriority {
  /** UI feedback, selection flash */
  Immediate = 0,
  /** Unit path tween */
  Movement = 1,
  /** Damage, projectiles */
  Combat = 2,
  /** Victory, level up */
  Celebration = 3,
  /** Ambient particles */
  Background = 4,
}

/**
 * Grid render layer stack (bottom to top):
 * Terrain → Grid borders → Movement → Attack → Units → Effects → FloatingText → Selection → Coordinates → Input
 *
 * Animations should respect AnimationPriority when a queue is added.
 */
export const BATTLE_LAYER_STACK = [
  'terrain',
  'grid',
  'movement',
  'attack',
  'units',
  'effects',
  'floatingText',
  'selection',
  'coordinates',
  'input',
] as const;

export type BattleLayerId = (typeof BATTLE_LAYER_STACK)[number];
