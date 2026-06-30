import type { ColorPalette } from './colors';
import { spacing } from './spacing';
import { sizes } from './sizes';
import { icons } from './icons';

function withAlpha(hex: string, alpha: number): string {
  if (hex.startsWith('rgba')) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Static battle layout ratios and clamps — not palette-dependent */
export const battleLayout = {
  headerRatio: 0.15,
  logHeightRatio: 0.09,
  actionRatio: 0.11,
  headerMin: 108,
  headerMax: 168,
  statusSlotMin: 24,
  statusSlotMax: 36,
  actionMin: 68,
  actionMax: 88,
  logMin: 52,
  logMax: 72,
  hexSizeMin: 12,
  hexSizeMaxRatio: 0.042,
  hexSizeMaxCap: 30,
  webHexSizeMaxRatio: 0.055,
  webHexSizeMaxCap: 44,
  webLogHeightRatio: 0.1,
  webLogMin: 72,
  webLogMax: 110,
  webPanelMaxWidthRatio: 0.3,
  webPanelMaxWidth: 300,
} as const;

export type BattleLayout = typeof battleLayout;

export interface BattleTileTokens {
  default: string;
  variant0: string;
  variant1: string;
  variant2: string;
  blocked: string;
  border: string;
  borderSubtle: string;
  hover: string;
  selected: string;
  move: string;
  movePath: string;
  attack: string;
  invalid: string;
  label: string;
}

export interface BattleCommandTokens {
  primary: string;
  success: string;
  magic: string;
  warning: string;
  neutral: string;
  disabled: string;
  background: string;
  border: string;
}

export interface BattleGameTokens {
  hexSize: number;
  gridSpacing: number;
  movementRangeOpacity: number;
  attackRangeOpacity: number;
  floatingDamageOffset: { x: number; y: number };
  actionBarHeight: number;
  healthBarHeight: number;
  healthBarHeightLg: number;
  statusEffectIconSize: number;
  floatingCombatTextSize: number;
  tile: BattleTileTokens;
  command: BattleCommandTokens;
  layout: BattleLayout;
}

export function createBattleTokens(colors: ColorPalette): BattleGameTokens {
  return {
    hexSize: 18,
    gridSpacing: spacing.sm,
    movementRangeOpacity: 0.32,
    attackRangeOpacity: 0.48,
    floatingDamageOffset: { x: 0, y: -12 },
    actionBarHeight: sizes.bottomNav,
    healthBarHeight: sizes.progressBar.sm,
    healthBarHeightLg: sizes.progressBar.md,
    statusEffectIconSize: icons.sm,
    floatingCombatTextSize: 14,
    layout: battleLayout,
    tile: {
      default: colors.surfaceElevated,
      variant0: colors.surfaceElevated,
      variant1: colors.surfacePressed,
      variant2: withAlpha(colors.secondary, 0.85),
      blocked: colors.surfacePressed,
      border: colors.border,
      borderSubtle: withAlpha(colors.border, 0.5),
      hover: withAlpha(colors.text, 0.1),
      selected: withAlpha(colors.primary, 0.15),
      move: withAlpha(colors.text, 0.07),
      movePath: withAlpha(colors.success, 0.34),
      attack: withAlpha(colors.success, 0.3),
      invalid: withAlpha(colors.error, 0.2),
      label: colors.textMuted,
    },
    command: {
      primary: colors.info,
      success: colors.success,
      magic: colors.primary,
      warning: colors.gold,
      neutral: colors.mana,
      disabled: colors.textMuted,
      background: colors.surfaceGlass,
      border: colors.borderStrong,
    },
  };
}
