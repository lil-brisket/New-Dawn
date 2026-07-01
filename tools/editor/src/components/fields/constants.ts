import type { ElementType } from '@dawn/types';

/** Elements shown in skill/status metadata editors. */
export const EDITOR_ELEMENTS: { value: ElementType; label: string }[] = [
  { value: 'fire', label: 'Fire' },
  { value: 'ice', label: 'Water' },
  { value: 'wind', label: 'Wind' },
  { value: 'earth', label: 'Earth' },
  { value: 'lightning', label: 'Lightning' },
];

export const ELEMENTS: ElementType[] = EDITOR_ELEMENTS.map((e) => e.value);

/** Elements for damage/DOT effects, including no element. */
export const EFFECT_ELEMENT_OPTIONS: { value: ElementType | ''; label: string }[] = [
  { value: '', label: 'None' },
  ...EDITOR_ELEMENTS,
];

export const ELEMENT_EMOJI: Partial<Record<ElementType, string>> = {
  fire: '🔥',
  ice: '💧',
  wind: '💨',
  earth: '🪨',
  lightning: '⚡',
};

export const SHAPE_TYPES = [
  { value: 'line', label: 'Line' },
  { value: 'aoe', label: 'AoE' },
  { value: 'cone', label: 'Cone' },
] as const;

export type ShapeType = (typeof SHAPE_TYPES)[number]['value'];

export const TARGET_TYPES = [
  { value: 'single_enemy', label: 'Single Enemy' },
  { value: 'single_ally', label: 'Single Ally' },
  { value: 'self', label: 'Self' },
  { value: 'tile', label: 'Tile' },
] as const;

export const STAT_MOD_MODES = [
  { value: 'flat', label: 'Flat' },
  { value: 'percent', label: 'Percent' },
] as const;

export const TRIGGER_EVENTS = [
  { value: 'on_hit', label: 'On Hit' },
  { value: 'on_damaged', label: 'On Damaged' },
  { value: 'on_turn_start', label: 'On Turn Start' },
  { value: 'on_move', label: 'On Move' },
  { value: 'on_attack', label: 'On Attack' },
] as const;

export const EFFECT_TYPES = [
  { value: 'damage', label: 'Damage' },
  { value: 'heal', label: 'Heal' },
  { value: 'apply_status', label: 'Status' },
  { value: 'shield', label: 'Shield' },
  { value: 'move', label: 'Move' },
  { value: 'summon', label: 'Summon' },
] as const;

export const BEHAVIOR_TYPES = [
  { value: 'dot', label: 'DoT' },
  { value: 'stat_mod', label: 'Stat Mod' },
  { value: 'control', label: 'Control' },
  { value: 'trigger', label: 'Trigger' },
] as const;

export const RESOURCE_TYPES = [
  { value: 'hp', label: 'HP' },
  { value: 'sp', label: 'SP' },
  { value: 'ap', label: 'AP' },
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number]['value'];

export const ID_PATTERNS: Record<'skills' | 'statuses', RegExp> = {
  skills: /^skill_[a-z0-9_]+$/,
  statuses: /^status_[a-z0-9_]+$/,
};

export const ID_PATTERN_HINTS: Record<'skills' | 'statuses', string> = {
  skills: 'skill_snake_case (e.g. skill_fireball)',
  statuses: 'status_snake_case (e.g. status_burn)',
};
