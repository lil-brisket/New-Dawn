import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { PressableScale } from '../../_internal/PressableScale';
import type { BottomNavProps } from './BottomNav.types';

function BottomNavComponent({ items, testID }: BottomNavProps) {
  const { theme } = useTheme();
  const { colors, sizes, typography, border, opacity } = theme;

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          height: sizes.bottomNav,
          backgroundColor: colors.surfaceElevated,
          borderTopColor: colors.border,
          borderTopWidth: border.thin,
        },
      ]}
    >
      {items.map((item, index) => {
        const textColor = item.active ? colors.gold : colors.textMuted;
        return (
          <PressableScale
            key={`${item.label}-${index}`}
            style={styles.item}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            accessibilityState={{ selected: item.active }}
          >
            <View style={{ opacity: item.active ? 1 : opacity.pressed }}>{item.icon}</View>
            <Text
              style={{
                color: textColor,
                fontSize: typography.fontSize.xs,
                marginTop: 2,
                fontWeight: item.active
                  ? typography.fontWeight.semibold
                  : typography.fontWeight.regular,
              }}
            >
              {item.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row' },
  item: { flex: 1 },
});

export const BottomNav = memo(BottomNavComponent);
/** @deprecated Use BottomNav */
export const BottomNavigation = BottomNav;
export type { BottomNavProps, BottomNavItem } from './BottomNav.types';
