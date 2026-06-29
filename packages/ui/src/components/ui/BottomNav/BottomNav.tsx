import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { PressableScale } from '../../_internal/PressableScale';
import type { BottomNavProps } from './BottomNav.types';

function BottomNavComponent({ items, testID }: BottomNavProps) {
  const { colors, sizes, components, typography } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          height: sizes.bottomNav,
          backgroundColor: colors.surfaceElevated,
          borderTopColor: colors.border,
        },
      ]}
    >
      {items.map((item, index) => {
        const stateTokens = item.active
          ? components.bottomNav.active
          : components.bottomNav.inactive;
        return (
          <PressableScale
            key={`${item.label}-${index}`}
            style={styles.item}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            accessibilityState={{ selected: item.active }}
          >
            <View style={{ opacity: item.active ? 1 : 0.85 }}>{item.icon}</View>
            <Text
              style={{
                color: stateTokens.text,
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
  base: { flexDirection: 'row', borderTopWidth: 1 },
  item: { flex: 1 },
});

export const BottomNav = memo(BottomNavComponent);
/** @deprecated Use BottomNav */
export const BottomNavigation = BottomNav;
export type { BottomNavProps, BottomNavItem } from './BottomNav.types';
