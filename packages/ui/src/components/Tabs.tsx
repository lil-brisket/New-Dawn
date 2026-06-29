import React, { memo } from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme';

export interface Tab {
  key: string;
  label: string;
}

export interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onTabPress: (key: string) => void;
  testID?: string;
}

function TabsComponent({ tabs, activeKey, onTabPress, testID }: TabsProps) {
  const { theme } = useTheme();
  const { colors, spacing, radius, typography } = theme;

  return (
    <ScrollView
      testID={testID}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, { gap: spacing.sm }]}
    >
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={[
              styles.tab,
              {
                backgroundColor: active ? colors.primary : colors.transparent,
                borderRadius: radius.md,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <Text
              style={{
                color: active ? colors.text : colors.textMuted,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  tab: {},
});

export const Tabs = memo(TabsComponent);
