import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { ScreenLayout } from './ScreenLayout';

export function AuthLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { spacing } = theme;

  return (
    <ScreenLayout gradient>
      <View style={[styles.container, { padding: spacing.xl }]}>{children}</View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
});
