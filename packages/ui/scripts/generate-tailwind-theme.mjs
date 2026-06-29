import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Inline token values — keep in sync with src/theme/toTailwind.ts */
const darkPalette = {
  primary: '#6B4EFF',
  primaryLight: '#8B74FF',
  primaryDark: '#4A32CC',
  secondary: '#2E2648',
  gold: '#FFB84D',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  surface: '#0F0B1E',
  surfaceElevated: '#1A1530',
  surfaceGlass: 'rgba(35, 29, 58, 0.72)',
  border: '#3D3560',
  borderStrong: '#524A78',
  text: '#F5F0FF',
  textMuted: '#6B6088',
  background: '#0F0B1E',
};

const lightPalette = {
  ...darkPalette,
  primary: '#5B3EEF',
  primaryLight: '#7B64FF',
  primaryDark: '#3A22AA',
  secondary: '#E8E4F5',
  surface: '#FFFFFF',
  surfaceElevated: '#F0ECFA',
  surfaceGlass: 'rgba(255, 255, 255, 0.85)',
  border: '#D4CCE8',
  borderStrong: '#B8AED8',
  text: '#1A1035',
  background: '#F8F6FF',
};

const spacing = { 0: 0, 2: 2, 4: 4, 8: 8, 12: 12, 16: 16, 20: 20, 24: 24, 32: 32, 40: 40, 48: 48, 56: 56, 64: 64, 72: 72, 80: 80, 96: 96, 128: 128 };
const radius = { none: 0, xs: 4, sm: 6, md: 10, lg: 16, xl: 24, '2xl': 32, pill: 9999, circle: 9999 };
const fontSize = { xs: 11, sm: 13, md: 15, lg: 18, xl: 22, '2xl': 28, '3xl': 36, '4xl': 48 };
const opacity = { disabled: 0.4, pressed: 0.85, overlay: 0.85, backdrop: 0.72 };

function paletteToTailwindColors(palette) {
  return {
    primary: palette.primary,
    'primary-light': palette.primaryLight,
    'primary-dark': palette.primaryDark,
    secondary: palette.secondary,
    gold: palette.gold,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    surface: palette.surface,
    'surface-elevated': palette.surfaceElevated,
    'surface-glass': palette.surfaceGlass,
    border: palette.border,
    'border-strong': palette.borderStrong,
    text: palette.text,
    'text-muted': palette.textMuted,
    background: palette.background,
  };
}

const tailwindTheme = {
  colors: {
    ...paletteToTailwindColors(darkPalette),
    light: paletteToTailwindColors(lightPalette),
  },
  spacing: {
    0: `${spacing[0]}px`,
    0.5: `${spacing[2]}px`,
    1: `${spacing[4]}px`,
    2: `${spacing[8]}px`,
    3: `${spacing[12]}px`,
    4: `${spacing[16]}px`,
    5: `${spacing[20]}px`,
    6: `${spacing[24]}px`,
    7: `${spacing[32]}px`,
    8: `${spacing[40]}px`,
    9: `${spacing[48]}px`,
    10: `${spacing[56]}px`,
    12: `${spacing[64]}px`,
    14: `${spacing[72]}px`,
    16: `${spacing[80]}px`,
    20: `${spacing[96]}px`,
    24: `${spacing[128]}px`,
  },
  borderRadius: Object.fromEntries(Object.entries(radius).map(([k, v]) => [k, `${v}px`])),
  fontSize: Object.fromEntries(Object.entries(fontSize).map(([k, v]) => [k, `${v}px`])),
  opacity,
};

const outPath = path.resolve(__dirname, '../tailwind-theme.cjs');
const output = `/** Auto-generated — run pnpm generate:tailwind */\nmodule.exports = ${JSON.stringify(tailwindTheme, null, 2)};\n`;
writeFileSync(outPath, output, 'utf8');
console.log('Generated', outPath);
