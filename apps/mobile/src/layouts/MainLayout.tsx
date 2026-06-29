import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { TopBar, useTheme } from '@dawn/ui';
import { ScreenLayout } from './ScreenLayout';

export function MainLayout({
  title,
  children,
  onBack,
  rightAction,
}: {
  title: string;
  children: ReactNode;
  onBack?: () => void;
  rightAction?: ReactNode;
}) {
  const { theme } = useTheme();
  const { spacing } = theme;

  return (
    <ScreenLayout>
      <TopBar title={title} onBack={onBack} rightAction={rightAction} />
      <View style={[styles.content, { padding: spacing.lg }]}>{children}</View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
});
