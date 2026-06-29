import type { ReactNode } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme, type ThemePreference } from '@dawn/ui';
import { MainLayout } from '@/layouts/MainLayout';
import { FeatureFlags } from '@/constants/FeatureFlags';
import { ROUTES } from '@/navigation/routes';
import { Redirect } from 'expo-router';

const MODE_OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];

export function ThemePreviewScreen() {
  const { theme, mode, setMode } = useTheme();

  if (!FeatureFlags.developerTools) {
    return <Redirect href={ROUTES.HOME} />;
  }

  const {
    colors,
    spacing,
    typography,
    radius,
    shadow,
    animation,
    border,
    opacity,
    layout,
    elevation,
    zIndex,
    game,
    icons,
  } = theme;

  return (
    <MainLayout title="Theme Preview">
      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing['3xl'] }}>
        <Section title="Appearance">
          <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
            {MODE_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setMode(option)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.md,
                  backgroundColor: mode === option ? colors.primary : colors.surfacePressed,
                }}
              >
                <Text style={{ color: colors.text, fontSize: typography.fontSize.sm }}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Section>

        <Section title="Colors">
          {Object.entries(colors)
            .filter(([, value]) => typeof value === 'string')
            .map(([key, value]) => (
              <Swatch key={key} label={key} color={value as string} />
            ))}
        </Section>

        <Section title="Spacing">
          {Object.entries(spacing).map(([key, value]) => (
            <TokenRow key={key} label={key} value={String(value)} />
          ))}
        </Section>

        <Section title="Typography">
          {Object.entries(typography.textStyles).map(([key, style]) => (
            <Text
              key={key}
              style={{
                color: colors.text,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                lineHeight: style.lineHeight,
              }}
            >
              {key} — The quick brown fox
            </Text>
          ))}
        </Section>

        <Section title="Border">
          {Object.entries(border).map(([key, value]) => (
            <TokenRow key={key} label={key} value={String(value)} />
          ))}
        </Section>

        <Section title="Opacity">
          {Object.entries(opacity).map(([key, value]) => (
            <TokenRow key={key} label={key} value={String(value)} />
          ))}
        </Section>

        <Section title="Layout">
          {Object.entries(layout).map(([key, value]) => (
            <TokenRow key={key} label={key} value={String(value)} />
          ))}
        </Section>

        <Section title="Icons">
          {Object.entries(icons).map(([key, value]) => (
            <TokenRow key={key} label={key} value={`${value}px`} />
          ))}
        </Section>

        <Section title="Elevation">
          {Object.entries(elevation).map(([key, value]) => (
            <TokenRow key={key} label={key} value={String(value)} />
          ))}
        </Section>

        <Section title="Z-Index">
          {Object.entries(zIndex).map(([key, value]) => (
            <TokenRow key={key} label={key} value={String(value)} />
          ))}
        </Section>

        <Section title="Game — Battle">
          {Object.entries(game.battle).map(([key, value]) => (
            <TokenRow key={key} label={key} value={JSON.stringify(value)} />
          ))}
        </Section>

        <Section title="Game — Inventory">
          {Object.entries(game.inventory).map(([key, value]) => (
            <TokenRow key={key} label={key} value={String(value)} />
          ))}
        </Section>

        <Section title="Shadows">
          {Object.keys(shadow).map((key) => (
            <View
              key={key}
              style={[
                {
                  backgroundColor: colors.surface,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                  borderRadius: radius.md,
                },
                shadow[key as keyof typeof shadow],
              ]}
            >
              <Text style={{ color: colors.textMuted }}>{key}</Text>
            </View>
          ))}
        </Section>

        <Section title="Animation">
          {Object.entries(animation.duration).map(([key, value]) => (
            <TokenRow key={key} label={`duration.${key}`} value={`${value}ms`} />
          ))}
          {Object.entries(animation.spring).map(([key, value]) => (
            <TokenRow key={key} label={`spring.${key}`} value={JSON.stringify(value)} />
          ))}
        </Section>
      </ScrollView>
    </MainLayout>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
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

function TokenRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  const { colors, typography } = theme;
  return (
    <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.sm }}>
      {label}: {value}
    </Text>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  const { theme } = useTheme();
  const { spacing, typography, radius, border } = theme;
  return (
    <View style={[styles.swatchRow, { gap: spacing.sm, marginBottom: spacing.xs }]}>
      <View
        style={[
          styles.swatch,
          { backgroundColor: color, borderRadius: radius.xs, borderWidth: border.thin },
        ]}
      />
      <Text style={{ color: color, fontSize: typography.fontSize.xs }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  swatchRow: { flexDirection: 'row', alignItems: 'center' },
  swatch: { width: 24, height: 24 },
});
