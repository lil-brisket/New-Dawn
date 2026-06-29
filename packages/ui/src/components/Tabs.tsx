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
  const { colors, spacing, radius } = useTheme();

  return (
    <ScrollView
      testID={testID}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
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
                backgroundColor: active ? colors.primary : 'transparent',
                borderRadius: radius.md,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <Text style={{ color: active ? colors.text : colors.textSecondary, fontWeight: '600' }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  tab: {},
});

export const Tabs = memo(TabsComponent);
