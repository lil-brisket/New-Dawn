export interface BattleScene {
  readonly id: string;
  readonly name: string;
  readonly backgroundKey: string;
  readonly musicKey?: string;
  readonly lighting?: 'day' | 'night' | 'dungeon';
  readonly fog?: boolean;
  readonly weather?: 'clear' | 'rain' | 'snow';
  readonly particlePreset?: string;
}

export const BATTLE_SCENES: Record<string, BattleScene> = {
  training_field: {
    id: 'training_field',
    name: 'Training Field',
    backgroundKey: 'bg_training_field',
    lighting: 'day',
    weather: 'clear',
  },
  duel_arena: {
    id: 'duel_arena',
    name: 'Duel Arena',
    backgroundKey: 'bg_duel_arena',
    lighting: 'day',
    weather: 'clear',
  },
  grand_arena: {
    id: 'grand_arena',
    name: 'Grand Arena',
    backgroundKey: 'bg_grand_arena',
    lighting: 'night',
    fog: true,
    weather: 'clear',
    particlePreset: 'arena_embers',
  },
};

export function getBattleScene(id: string): BattleScene {
  return BATTLE_SCENES[id] ?? BATTLE_SCENES.training_field!;
}
