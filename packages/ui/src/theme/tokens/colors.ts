const rarity = {
  common: '#9CA3AF',
  uncommon: '#34D399',
  rare: '#60A5FA',
  epic: '#A78BFA',
  legendary: '#FBBF24',
  mythic: '#F472B6',
} as const;

const brand = {
  primary: '#6B4EFF',
  primaryLight: '#8B74FF',
  primaryDark: '#4A32CC',
  secondary: '#2E2648',
  gold: '#FFB84D',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  health: '#EF4444',
  healthBg: '#3B1515',
  mana: '#3B82F6',
  manaBg: '#152040',
} as const;

/** Dark RPG palette — default Dawn aesthetic */
export const darkPalette = {
  ...brand,
  background: '#0F0B1E',
  surface: '#0F0B1E',
  surfaceElevated: '#1A1530',
  surfaceGlass: 'rgba(35, 29, 58, 0.72)',
  surfacePressed: '#2E2648',
  surfaceDisabled: 'rgba(35, 29, 58, 0.5)',
  text: '#F5F0FF',
  textMuted: '#6B6088',
  textInverse: '#0F0B1E',
  border: '#3D3560',
  divider: '#3D3560',
  borderStrong: '#524A78',
  overlay: 'rgba(15, 11, 30, 0.85)',
  backdrop: 'rgba(15, 11, 30, 0.72)',
  disabled: 'rgba(107, 96, 136, 0.5)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  glow: 'rgba(107, 78, 255, 0.35)',
  gradientStart: '#1A1035',
  gradientEnd: '#0F0B1E',
  rarity,
  /** @deprecated Remove after Phase 7 — use `text` */
  textPrimary: '#F5F0FF',
  /** @deprecated Remove after Phase 7 — use `textMuted` with secondary styling */
  textSecondary: '#A89EC8',
  /** @deprecated Remove after Phase 7 — use `error` */
  danger: '#F87171',
  /** @deprecated Remove after Phase 7 — use `gold` */
  accent: '#FFB84D',
  /** @deprecated Remove after Phase 7 — use `gold` */
  accentLight: '#FFD080',
  /** @deprecated Remove after Phase 7 — use `background` */
  backgroundElevated: '#1A1530',
  /** @deprecated Remove after Phase 7 — use `surfacePressed` */
  surfaceLight: '#2E2648',
} as const;

/** Light palette — inverted surfaces with preserved brand hues */
export const lightPalette = {
  ...brand,
  primary: '#5B3EEF',
  primaryLight: '#7B64FF',
  primaryDark: '#3A22AA',
  secondary: '#E8E4F5',
  background: '#F8F6FF',
  surface: '#FFFFFF',
  surfaceElevated: '#F0ECFA',
  surfaceGlass: 'rgba(255, 255, 255, 0.85)',
  surfacePressed: '#E4DFF5',
  surfaceDisabled: 'rgba(240, 236, 250, 0.6)',
  text: '#1A1035',
  textMuted: '#6B6088',
  textInverse: '#F5F0FF',
  border: '#D4CCE8',
  divider: '#E0DAF0',
  borderStrong: '#B8AED8',
  overlay: 'rgba(26, 16, 53, 0.55)',
  backdrop: 'rgba(26, 16, 53, 0.4)',
  disabled: 'rgba(107, 96, 136, 0.4)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  glow: 'rgba(91, 62, 239, 0.25)',
  gradientStart: '#F0ECFA',
  gradientEnd: '#F8F6FF',
  rarity,
  textPrimary: '#1A1035',
  textSecondary: '#524A78',
  danger: '#DC2626',
  accent: '#E89B1C',
  accentLight: '#F5B84D',
  backgroundElevated: '#F0ECFA',
  surfaceLight: '#E4DFF5',
} as const;

export type ColorPalette = typeof darkPalette | typeof lightPalette;
export type ThemeMode = 'light' | 'dark';
export type ThemePreference = ThemeMode | 'system';

export function getPalette(mode: ThemeMode): ColorPalette {
  return mode === 'light' ? lightPalette : darkPalette;
}

/** @deprecated Remove after Phase 7 — use darkPalette or getPalette() */
export const colors = darkPalette;
