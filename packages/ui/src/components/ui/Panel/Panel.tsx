import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { createPanelVariants } from '../../../theme/components/button';
import { GlassSurface } from '../../_internal/GlassSurface';
import type { PanelProps, PanelHeaderProps, PanelBodyProps, PanelFooterProps } from './Panel.types';

function PanelRoot({
  variant = 'default',
  borderStyle = 'default',
  children,
  style,
  testID,
  ...props
}: PanelProps) {
  const { theme } = useTheme();
  const { colors, radius, shadow } = theme;
  const panelVariants = useMemo(
    () => createPanelVariants(colors, { glow: shadow.glow, md: shadow.md }),
    [colors, shadow],
  );
  const tokens = panelVariants[variant];

  return (
    <GlassSurface
      testID={testID}
      style={[
        {
          backgroundColor: tokens.bg,
          borderColor: tokens.border,
          borderWidth: tokens.borderWidth,
          borderRadius: radius.lg,
        },
        tokens.shadow,
        borderStyle === 'ornate' ? shadow.glow : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </GlassSurface>
  );
}

function PanelHeader({ title, subtitle, icon, children, testID }: PanelHeaderProps) {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;

  if (children) {
    return <View testID={testID}>{children}</View>;
  }

  return (
    <View testID={testID} style={[styles.header, { marginBottom: spacing.md }]}>
      {icon ? <View style={{ marginRight: spacing.sm }}>{icon}</View> : null}
      <View style={styles.headerText}>
        {title ? (
          <Text
            style={{
              color: colors.text,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
            }}
          >
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            style={{
              color: colors.textMuted,
              fontSize: typography.fontSize.sm,
              marginTop: spacing[2],
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function PanelBody({ children, testID }: PanelBodyProps) {
  return <View testID={testID}>{children}</View>;
}

function PanelFooter({ children, testID }: PanelFooterProps) {
  const { theme } = useTheme();
  const { spacing, colors, border } = theme;

  return (
    <View
      testID={testID}
      style={[
        styles.footer,
        {
          marginTop: spacing.md,
          borderTopColor: colors.border,
          borderTopWidth: border.thin,
          paddingTop: spacing.md,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
  headerText: { flex: 1 },
  footer: {},
});

export const Panel = Object.assign(memo(PanelRoot), {
  Header: memo(PanelHeader),
  Body: memo(PanelBody),
  Footer: memo(PanelFooter),
});

export type {
  PanelProps,
  PanelVariant,
  PanelHeaderProps,
  PanelBodyProps,
  PanelFooterProps,
} from './Panel.types';
