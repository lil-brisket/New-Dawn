import React, { memo } from 'react';
import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { useTheme } from '../theme';

export interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  testID?: string;
}

function CardComponent({ title, subtitle, children, style, testID, ...props }: CardProps) {
  const { colors, radius, spacing, shadows } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderColor: colors.border,
          borderWidth: 1,
        },
        shadows.sm,
        style,
      ]}
      {...props}
    >
      {title ? (
        <Text style={[styles.title, { color: colors.text, fontSize: 16, fontWeight: '600' }]}>
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>{subtitle}</Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
  title: { marginBottom: 8 },
});

export const Card = memo(CardComponent);
