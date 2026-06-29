import { semantic } from './semantic';

/** Brand / action colors */
const brand = {
  primary: '#6B4EFF',
  primaryLight: '#8B74FF',
  primaryDark: '#4A32CC',
  secondary: '#2E2648',
  accent: '#FFB84D',
  accentLight: '#FFD080',
  danger: '#F87171',
  success: '#4ADE80',
  warning: '#FBBF24',
  info: '#60A5FA',
} as const;

export const colors = {
  ...brand,
  ...semantic,
  rarity: {
    common: '#9CA3AF',
    uncommon: '#34D399',
    rare: '#60A5FA',
    epic: '#A78BFA',
    legendary: '#FBBF24',
  },
  health: '#EF4444',
  healthBg: '#3B1515',
  mana: '#3B82F6',
  manaBg: '#152040',
  gradientStart: '#1A1035',
  gradientEnd: '#0F0B1E',
  // Deprecated aliases — keep for backward compatibility during migration
  background: semantic.surface,
  backgroundElevated: semantic.surfaceElevated,
  surfaceLight: semantic.surfacePressed,
  text: semantic.textPrimary,
  error: brand.danger,
} as const;

export type Colors = typeof colors;
