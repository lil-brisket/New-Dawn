import type { ElementType } from '@dawn/types';

export const ELEMENTS: ElementType[] = [
  'physical',
  'fire',
  'ice',
  'lightning',
  'wind',
  'earth',
  'light',
  'dark',
];

export const ELEMENT_EMOJI: Record<ElementType, string> = {
  physical: '⚔',
  fire: '🔥',
  ice: '❄',
  lightning: '⚡',
  wind: '💨',
  earth: '🪨',
  light: '✨',
  dark: '☠',
};

export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;

export const SKILL_CATEGORIES = ['physical', 'magic', 'support', 'misc'] as const;

export const AREA_FILTERS = [
  { value: 'enemy', label: 'Enemy Only' },
  { value: 'ally', label: 'Ally Only' },
  { value: 'all', label: 'All' },
] as const;

export const AREA_CENTERS = [
  { value: 'unit', label: 'Target Unit' },
  { value: 'tile', label: 'Target Tile' },
] as const;

export const TARGET_TYPES = [
  { value: 'single_enemy', label: 'Single Enemy' },
  { value: 'single_ally', label: 'Single Ally' },
  { value: 'self', label: 'Self' },
  { value: 'tile', label: 'Tile' },
  { value: 'area', label: 'Area' },
] as const;

export const STAT_MOD_MODES = [
  { value: 'flat', label: 'Flat' },
  { value: 'percent', label: 'Percent' },
] as const;

export const TRIGGER_EVENTS = [
  { value: 'on_hit', label: 'On Hit' },
  { value: 'on_damaged', label: 'On Damaged' },
  { value: 'on_turn_start', label: 'On Turn Start' },
] as const;

export const EFFECT_TYPES = [
  'damage',
  'heal',
  'apply_status',
  'move',
  'teleport',
  'summon',
] as const;

export const BEHAVIOR_TYPES = ['dot', 'stat_mod', 'control', 'trigger'] as const;

export const COMMON_TAGS: { tag: string; color: string }[] = [
  { tag: 'movement', color: '#5b9bd5' },
  { tag: 'aoe', color: '#e67e22' },
  { tag: 'fire', color: '#e74c3c' },
  { tag: 'debuff', color: '#9b59b6' },
  { tag: 'buff', color: '#2ecc71' },
  { tag: 'boss', color: '#f1c40f' },
  { tag: 'heal', color: '#1abc9c' },
  { tag: 'control', color: '#95a5a6' },
];

export const TAG_COLORS: Record<string, string> = Object.fromEntries(
  COMMON_TAGS.map(({ tag, color }) => [tag, color]),
);

export const RESOURCE_TYPES = [
  { value: 'hp', label: 'HP' },
  { value: 'sp', label: 'SP' },
  { value: 'ap', label: 'AP' },
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number]['value'];

export const SKILL_MINIMUM_HP_AFTER_COST = 1;
