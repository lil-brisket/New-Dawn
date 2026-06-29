import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { TopBar } from '@dawn/ui';
import { useTheme } from '@dawn/ui';

export interface AppTopBarProps {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
}

export function AppTopBar({ title, onBack, rightAction }: AppTopBarProps) {
  const { theme } = useTheme();
  const { spacing } = theme;

  return (
    <View style={styles.wrapper}>
      <TopBar title={title} onBack={onBack} rightAction={rightAction} />
      {rightAction ? (
        <View style={[styles.rightSlot, { paddingRight: spacing.lg }]}>{rightAction}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  rightSlot: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
