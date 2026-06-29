import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface BottomNavItem {
  key: string;
  label: string;
  icon?: string;
}

export interface BottomNavigationProps {
  items: BottomNavItem[];
  activeKey: string;
  onItemPress: (key: string) => void;
  testID?: string;
}

function BottomNavigationComponent({
  items,
  activeKey,
  onItemPress,
  testID,
}: BottomNavigationProps) {
  const { colors, sizes } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          height: sizes.bottomNav,
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.border,
        },
      ]}
    >
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={() => onItemPress(item.key)}
          >
            <Text style={{ fontSize: 18 }}>{item.icon ?? '●'}</Text>
            <Text
              style={{
                color: active ? colors.accent : colors.textMuted,
                fontSize: 11,
                marginTop: 2,
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const BottomNavigation = memo(BottomNavigationComponent);
