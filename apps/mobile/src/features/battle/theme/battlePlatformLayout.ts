import { Platform } from 'react-native';

export type BattlePlatformKey = 'web' | 'native';

/** Grid + chrome tuning — web and native are intentionally separate */
export interface BattlePlatformLayout {
  key: BattlePlatformKey;
  axisMarginRatio: number;
  axisMarginMin: number;
  hexSizeMaxRatio: number;
  hexSizeMaxCap: number;
  hexSizeMinBoost: number;
  gridPadding: 'xs' | 'sm';
  logHeightRatio: number;
  logMin: number;
  logMax: number;
  actionBarMaxBoost: number;
  headerMaxBoost: number;
  headerRatioScale: number;
  headerMinAdjust: number;
  headerPadding: 'sm' | 'lg';
  panelMaxWidth?: number;
  panelMaxWidthRatio?: number;
  actionBarPadding: 'tight' | 'normal' | 'wide';
  actionButtonLayout: 'equal-flex' | 'equal-percent';
  compactHeader: boolean;
}

const NATIVE_LAYOUT: BattlePlatformLayout = {
  key: 'native',
  axisMarginRatio: 0.42,
  axisMarginMin: 18,
  hexSizeMaxRatio: 0.09,
  hexSizeMaxCap: 56,
  hexSizeMinBoost: 2,
  gridPadding: 'xs',
  logHeightRatio: 0.065,
  logMin: 40,
  logMax: 56,
  actionBarMaxBoost: 0,
  headerMaxBoost: -4,
  headerRatioScale: 0.92,
  headerMinAdjust: 4,
  headerPadding: 'sm',
  actionBarPadding: 'tight',
  actionButtonLayout: 'equal-flex',
  compactHeader: true,
};

const WEB_LAYOUT: BattlePlatformLayout = {
  key: 'web',
  axisMarginRatio: 0.5,
  axisMarginMin: 20,
  hexSizeMaxRatio: 0.1,
  hexSizeMaxCap: 96,
  hexSizeMinBoost: 10,
  gridPadding: 'xs',
  logHeightRatio: 0.07,
  logMin: 60,
  logMax: 78,
  actionBarMaxBoost: -6,
  headerMaxBoost: 48,
  headerRatioScale: 1.15,
  headerMinAdjust: 24,
  headerPadding: 'lg',
  panelMaxWidth: 380,
  panelMaxWidthRatio: 0.34,
  actionBarPadding: 'wide',
  actionButtonLayout: 'equal-flex',
  compactHeader: false,
};

export function getBattlePlatformLayout(): BattlePlatformLayout {
  return Platform.OS === 'web' ? WEB_LAYOUT : NATIVE_LAYOUT;
}

export interface GridAxisConfig {
  marginRatio: number;
  marginMin: number;
}

export function gridAxisFromPlatform(platform: BattlePlatformLayout): GridAxisConfig {
  return { marginRatio: platform.axisMarginRatio, marginMin: platform.axisMarginMin };
}
