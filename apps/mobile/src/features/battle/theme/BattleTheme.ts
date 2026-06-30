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

  const headerRatio = platform.key === 'web' ? layout.headerRatio * 1.15 : layout.headerRatio;
  const headerMin = platform.key === 'web' ? layout.headerMin + 24 : layout.headerMin;

  const headerHeight = clamp(
    screenHeight * headerRatio,
    headerMin,
    layout.headerMax + platform.headerMaxBoost,
  );

  const logHeight = clamp(screenHeight * platform.logHeightRatio, platform.logMin, platform.logMax);

  const hexSizeMax = clamp(
    Math.min(screenWidth, screenHeight) * platform.hexSizeMaxRatio,
    layout.hexSizeMin + platform.hexSizeMinBoost,
    platform.hexSizeMaxCap,
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
      platform.key === 'web' ? sizes.avatar.lg : isSmall ? sizes.avatar.sm : sizes.avatar.md,
    statusSlotHeight: clamp(
      screenHeight * (platform.key === 'web' ? 0.04 : 0.03),
      layout.statusSlotMin,
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
