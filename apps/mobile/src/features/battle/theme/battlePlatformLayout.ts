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
  headerPadding: 'sm' | 'lg';
  panelMaxWidth?: number;
  panelMaxWidthRatio?: number;
  actionBarPadding: 'tight' | 'normal' | 'wide';
  actionButtonLayout: 'equal-flex' | 'equal-percent';
}

const NATIVE_LAYOUT: BattlePlatformLayout = {
  key: 'native',
  axisMarginRatio: 0.9,
  axisMarginMin: 30,
  hexSizeMaxRatio: 0.05,
  hexSizeMaxCap: 38,
  hexSizeMinBoost: 4,
  gridPadding: 'xs',
  logHeightRatio: 0.09,
  logMin: 52,
  logMax: 72,
  actionBarMaxBoost: 0,
  headerMaxBoost: 0,
  headerPadding: 'sm',
  actionBarPadding: 'tight',
  actionButtonLayout: 'equal-percent',
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
  headerPadding: 'lg',
  panelMaxWidth: 380,
  panelMaxWidthRatio: 0.34,
  actionBarPadding: 'wide',
  actionButtonLayout: 'equal-flex',
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
