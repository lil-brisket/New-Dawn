import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { TopBar } from '@dawn/ui';
import { ScreenLayout } from './ScreenLayout';

export function MainLayout({
  title,
  children,
  onBack,
}: {
  title: string;
  children: ReactNode;
  onBack?: () => void;
}) {
  return (
    <ScreenLayout>
      <TopBar title={title} onBack={onBack} />
      <View style={styles.content}>{children}</View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 16 },
});
