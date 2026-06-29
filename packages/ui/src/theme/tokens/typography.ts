import type { TextStyle } from 'react-native';

const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
  /** @deprecated Remove after Phase 7 */
  display: 'System',
} as const;

const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 36,
  '4xl': 48,
} as const;

const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 2,
  wider: 4,
  widest: 6,
  brand: 8,
} as const;

function textStyle(
  size: keyof typeof fontSize,
  weight: keyof typeof fontWeight,
  lh: keyof typeof lineHeight = 'normal',
): TextStyle {
  return {
    fontFamily: fontFamily.regular,
    fontSize: fontSize[size],
    fontWeight: fontWeight[weight],
    lineHeight: fontSize[size] * lineHeight[lh],
  };
}

export const typography = {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  textStyles: {
    display: textStyle('4xl', 'bold', 'tight'),
    title: textStyle('3xl', 'bold', 'tight'),
    heading: textStyle('2xl', 'semibold', 'tight'),
    subheading: textStyle('xl', 'semibold', 'normal'),
    body: textStyle('md', 'regular', 'normal'),
    caption: textStyle('xs', 'regular', 'normal'),
    button: textStyle('md', 'semibold', 'tight'),
    label: textStyle('sm', 'medium', 'normal'),
  },
} as const;

export type Typography = typeof typography;
