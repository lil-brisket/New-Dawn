import { useTheme, type Theme } from '@dawn/ui';
import { useWindowDimensions } from 'react-native';
import {
  getBattlePlatformLayout,
  gridAxisFromPlatform,
  type BattlePlatformLayout,
  type GridAxisConfig,
} from './battlePlatformLayout';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface BattleTheme {
  platform: BattlePlatformLayout;
  gridAxis: GridAxisConfig;
  headerHeight: number;
  panelWidth: number | 'flex';
  panelMaxWidth?: number;
  gridPadding: number;
  gridSpacing: number;
  logHeight: number;
  logMinHeight: number;
  actionBarHeight: number;
  portraitSize: number;
  statusSlotHeight: number;
  hexSizeMin: number;
  hexSizeMax: number;
  headerPaddingHorizontal: number;
}

export function createBattleTheme(
  theme: Theme,
  screenWidth: number,
  screenHeight: number,
): BattleTheme {
  const { spacing, game, sizes } = theme;
  const { layout } = game.battle;
  const platform = getBattlePlatformLayout();
  const isSmall = screenWidth < 380;

  const isLargePhone = screenWidth >= 400 && screenHeight >= 800;

  const headerRatio = layout.headerRatio * platform.headerRatioScale;
  const headerMin = layout.headerMin + platform.headerMinAdjust;

  const headerHeight = clamp(
    screenHeight * headerRatio,
    headerMin,
    layout.headerMax + platform.headerMaxBoost,
  );

  const logHeight = clamp(screenHeight * platform.logHeightRatio, platform.logMin, platform.logMax);

  const hexCap =
    platform.key === 'native' && isLargePhone ? platform.hexSizeMaxCap + 6 : platform.hexSizeMaxCap;
  const hexRatio =
    platform.key === 'native' && isLargePhone
      ? platform.hexSizeMaxRatio + 0.012
      : platform.hexSizeMaxRatio;

  const hexSizeMax = clamp(
    Math.min(screenWidth, screenHeight) * hexRatio,
    layout.hexSizeMin + platform.hexSizeMinBoost,
    hexCap,
  );

  const gridPadding = platform.gridPadding === 'sm' ? spacing.sm : spacing.xs;
  const headerPaddingHorizontal = platform.headerPadding === 'lg' ? spacing.lg : spacing.sm;

  return {
    platform,
    gridAxis: gridAxisFromPlatform(platform),
    headerHeight,
    panelWidth: 'flex',
    panelMaxWidth:
      platform.panelMaxWidth != null && platform.panelMaxWidthRatio != null
        ? Math.min(platform.panelMaxWidth, screenWidth * platform.panelMaxWidthRatio)
        : undefined,
    gridPadding,
    gridSpacing: game.battle.gridSpacing,
    logHeight,
    logMinHeight: platform.logMin,
    actionBarHeight: clamp(
      screenHeight * layout.actionRatio,
      layout.actionMin,
      layout.actionMax + platform.actionBarMaxBoost,
    ),
    portraitSize:
      platform.key === 'web'
        ? sizes.avatar.lg
        : platform.compactHeader
          ? sizes.avatar.sm
          : isSmall
            ? sizes.avatar.sm
            : sizes.avatar.md,
    statusSlotHeight: clamp(
      screenHeight * (platform.key === 'web' ? 0.04 : 0.025),
      platform.compactHeader ? 18 : layout.statusSlotMin,
      platform.key === 'web' ? layout.statusSlotMax + 8 : layout.statusSlotMax,
    ),
    hexSizeMin: layout.hexSizeMin,
    hexSizeMax,
    headerPaddingHorizontal,
  };
}

export function useBattleTheme(): BattleTheme {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  return createBattleTheme(theme, width, height);
}
