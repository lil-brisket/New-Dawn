import type { ElementType } from '@dawn/types';

/** Elements shown in skill/tag metadata editors. */
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

export const BEHAVIOR_TYPES = [
  { value: 'instant_damage', label: 'Instant Damage' },
  { value: 'instant_heal', label: 'Instant Heal' },
  { value: 'shield_grant', label: 'Shield Grant' },
  { value: 'move', label: 'Move' },
  { value: 'teleport', label: 'Teleport' },
  { value: 'summon', label: 'Summon' },
  { value: 'dot', label: 'DoT' },
  { value: 'stat_mod', label: 'Stat Mod' },
  { value: 'control', label: 'Control' },
  { value: 'trigger', label: 'Trigger' },
  { value: 'absorb', label: 'Absorb' },
  { value: 'lifesteal', label: 'Life Steal' },
  { value: 'reflect', label: 'Reflect' },
  { value: 'clear', label: 'Clear' },
  { value: 'cleanse', label: 'Cleanse' },
] as const;

export const RESOURCE_TYPES = [
  { value: 'hp', label: 'HP' },
  { value: 'sp', label: 'SP' },
  { value: 'ap', label: 'AP' },
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number]['value'];

export const COMMON_LABELS = [
  { label: 'physical' },
  { label: 'magic' },
  { label: 'support' },
  { label: 'debuff' },
  { label: 'buff' },
  { label: 'movement' },
] as const;

export const LABEL_COLORS: Record<string, string> = {
  physical: '#c97a4a',
  magic: '#6a8fd4',
  support: '#5cb87a',
  debuff: '#c45c5c',
  buff: '#d4b44a',
  movement: '#8a7ad4',
};

/** @deprecated Use COMMON_LABELS */
export const COMMON_TAGS = COMMON_LABELS.map((entry) => ({ tag: entry.label }));

/** @deprecated Use LABEL_COLORS */
export const TAG_COLORS = LABEL_COLORS;

export const ID_PATTERNS: Record<'skills' | 'tags', RegExp> = {
  skills: /^skill_[a-z0-9_]+$/,
  tags: /^tag_[a-z0-9_]+$/,
};

export const ID_PATTERN_HINTS: Record<'skills' | 'tags', string> = {
  skills: 'skill_snake_case (e.g. skill_fireball)',
  tags: 'tag_snake_case (e.g. tag_burn)',
};
