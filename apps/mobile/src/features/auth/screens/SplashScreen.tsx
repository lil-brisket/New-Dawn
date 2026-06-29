import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Panel } from '@dawn/ui';
import { ScreenLayout } from '@/layouts/ScreenLayout';

export function SplashScreen() {
  const { colors, spacing } = useTheme();

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.accent }]}>DAWN</Text>
        <Text style={{ color: colors.textSecondary, marginTop: spacing.sm }}>
          Tactical Fantasy RPG
        </Text>
        <Panel style={{ marginTop: spacing['3xl'], opacity: 0.6 }}>
          <Text style={{ color: colors.textMuted, textAlign: 'center' }}>Loading...</Text>
        </Panel>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 48, fontWeight: '800', letterSpacing: 8 },
});
