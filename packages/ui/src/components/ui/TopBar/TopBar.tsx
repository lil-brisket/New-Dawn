import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import type { TopBarProps } from './TopBar.types';

function TopBarComponent({
  title,
  subtitle,
  icon,
  leftAction,
  rightActions,
  onBack,
  rightAction,
  testID,
}: TopBarProps) {
  const { theme } = useTheme();
  const { colors, sizes, typography, spacing, border } = theme;

  const resolvedLeft =
    leftAction ??
    (onBack ? (
      <Pressable
        onPress={onBack}
        style={styles.actionSlot}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={spacing.sm}
      >
        <Text style={{ color: colors.gold, fontSize: typography.fontSize.lg }}>{'‹'}</Text>
      </Pressable>
    ) : (
      <View style={styles.actionSlot} />
    ));

  const resolvedRight = rightActions ?? (rightAction ? [rightAction] : []);

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          height: sizes.topBar,
          backgroundColor: colors.surfaceElevated,
          borderBottomColor: colors.border,
          borderBottomWidth: border.thin,
          paddingHorizontal: spacing.sm,
        },
      ]}
    >
      <View style={styles.actionSlot}>{resolvedLeft}</View>
      <View style={styles.center}>
        {icon ? <View style={{ marginBottom: spacing[2] }}>{icon}</View> : null}
        <Text
          style={{
            color: colors.text,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              color: colors.textMuted,
              fontSize: typography.fontSize.xs,
            }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.actionsRight, styles.actionSlot]}>
        {resolvedRight.map((action, i) => (
          <View key={i} style={styles.actionSlot}>
            {action}
          </View>
        ))}
        {resolvedRight.length === 0 ? <View style={styles.actionSlot} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: { flex: 1, alignItems: 'center' },
  actionSlot: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRight: { flexDirection: 'row' },
});

export const TopBar = memo(TopBarComponent);
export type { TopBarProps };
