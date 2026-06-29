import type { ReactNode } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';
import { FeatureFlags } from '@/constants/FeatureFlags';
import { ROUTES } from '@/navigation/routes';
import { Redirect } from 'expo-router';

export function ThemePreviewScreen() {
  const theme = useTheme();

  if (!FeatureFlags.developerTools) {
    return <Redirect href={ROUTES.HOME} />;
  }

  const { colors, spacing, typography, radius, shadows, motion } = theme;

  return (
    <MainLayout title="Theme Preview">
      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing['3xl'] }}>
        <Section title="Colors">
          {Object.entries(colors)
            .filter(([, value]) => typeof value === 'string')
            .map(([key, value]) => (
              <Swatch key={key} label={key} color={value as string} />
            ))}
        </Section>

        <Section title="Spacing">
          {Object.entries(spacing).map(([key, value]) => (
            <Text key={key} style={{ color: colors.textMuted, fontSize: typography.fontSize.sm }}>
              {key}: {value}
            </Text>
          ))}
        </Section>

        <Section title="Typography">
          {Object.entries(typography.fontSize).map(([key, value]) => (
            <Text key={key} style={{ color: colors.text, fontSize: value }}>
              {key} — The quick brown fox
            </Text>
          ))}
        </Section>

        <Section title="Radius">
          {Object.entries(radius).map(([key, value]) => (
            <View
              key={key}
              style={{
                backgroundColor: colors.surface,
                borderRadius: value,
                padding: spacing.sm,
                marginBottom: spacing.xs,
              }}
            >
              <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.xs }}>
                {key}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Shadows">
          {Object.entries(shadows).map(([key]) => (
            <View
              key={key}
              style={[
                {
                  backgroundColor: colors.surface,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                  borderRadius: radius.md,
                },
                shadows[key as keyof typeof shadows],
              ]}
            >
              <Text style={{ color: colors.textSecondary }}>{key}</Text>
            </View>
          ))}
        </Section>

        <Section title="Motion">
          {Object.entries(motion.durations).map(([key, value]) => (
            <Text key={key} style={{ color: colors.textMuted, fontSize: typography.fontSize.sm }}>
              durations.{key}: {value}ms
            </Text>
          ))}
        </Section>
      </ScrollView>
    </MainLayout>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { colors, typography, spacing } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <Text
        style={{
          color: colors.text,
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  const { spacing, typography } = useTheme();
  return (
    <View style={[styles.swatchRow, { gap: spacing.sm, marginBottom: spacing.xs }]}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <Text style={{ color: color, fontSize: typography.fontSize.xs }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  swatchRow: { flexDirection: 'row', alignItems: 'center' },
  swatch: { width: 24, height: 24, borderRadius: 4 },
});
