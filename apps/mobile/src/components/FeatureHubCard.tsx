import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { AppIcon, type AppIconName } from './AppIcon';
import { GradientPanel } from './GradientPanel';

export interface FeatureHubCardProps {
  title: string;
  subtitle: string;
  icon: AppIconName;
  onPress: () => void;
  disabled?: boolean;
}

export function FeatureHubCard({ title, subtitle, icon, onPress, disabled }: FeatureHubCardProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Navigate to ${title}`}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : disabled ? 0.5 : 1 }]}
    >
      <GradientPanel>
        <View style={[styles.row, { gap: spacing.md }]}>
          <AppIcon name={icon} size="lg" color={colors.accent} accessibilityLabel={title} />
          <View style={styles.textBlock}>
            <Text
              style={{
                color: colors.text,
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
              }}
              maxFontSizeMultiplier={1.5}
            >
              {title}
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.sm,
                marginTop: spacing.xs,
              }}
              maxFontSizeMultiplier={1.5}
            >
              {subtitle}
            </Text>
          </View>
        </View>
      </GradientPanel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  textBlock: { flex: 1 },
});
