import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { Panel } from './Panel';

export interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  testID?: string;
}

function WindowComponent({ title, children, testID }: WindowProps) {
  const { colors, spacing } = useTheme();

  return (
    <Panel testID={testID} variant="elevated" style={styles.container}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={{ color: colors.accent, fontSize: 18, fontWeight: '700' }}>{title}</Text>
      </View>
      <View style={{ paddingTop: spacing.md }}>{children}</View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  container: { minWidth: 280 },
  header: {
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
});

export const Window = memo(WindowComponent);
