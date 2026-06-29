import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
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
  const { components, radius, shadows } = useTheme();
  const tokens = components.panel[variant];

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
        borderStyle === 'ornate' ? shadows.glow : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </GlassSurface>
  );
}

function PanelHeader({ title, subtitle, icon, children, testID }: PanelHeaderProps) {
  const { colors, typography, spacing } = useTheme();

  if (children) {
    return <View testID={testID}>{children}</View>;
  }

  return (
    <View testID={testID} style={[styles.header, { marginBottom: spacing.md }]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.headerText}>
        {title ? (
          <Text
            style={{
              color: colors.textPrimary,
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
              color: colors.textSecondary,
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
  const { spacing, colors } = useTheme();

  return (
    <View
      testID={testID}
      style={[styles.footer, { marginTop: spacing.md, borderTopColor: colors.border }]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 8 },
  headerText: { flex: 1 },
  footer: { borderTopWidth: 1, paddingTop: 12 },
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
