import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { ScreenLayout } from './ScreenLayout';

export interface BattleLayoutProps {
  header: ReactNode;
  viewport: ReactNode;
  bottomBar: ReactNode;
}

export function BattleLayout({ header, viewport, bottomBar }: BattleLayoutProps) {
  const { spacing } = useTheme();

  return (
    <ScreenLayout>
      <View style={[styles.container, { padding: spacing.md, gap: spacing.sm }]}>
        {header}
        <View style={styles.viewport}>{viewport}</View>
        {bottomBar}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewport: { flex: 1, justifyContent: 'center' },
});
