import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenBackground } from '@/components/ScreenBackground';

export function ScreenLayout({
  children,
  gradient = false,
}: {
  children: ReactNode;
  gradient?: boolean;
}) {
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground gradient={gradient}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {children}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
