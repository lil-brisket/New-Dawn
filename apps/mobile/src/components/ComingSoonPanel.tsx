import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { AppIcon, type AppIconName } from './AppIcon';
import { GradientPanel } from './GradientPanel';

export interface ComingSoonPanelProps {
  title: string;
  description: string;
  icon?: AppIconName;
}

export function ComingSoonPanel({ title, description, icon = 'world' }: ComingSoonPanelProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <GradientPanel>
      <View style={[styles.row, { gap: spacing.md }]}>
        <AppIcon name={icon} size="xl" color={colors.accent} accessibilityLabel={title} />
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
            Coming Soon
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: typography.fontSize.sm,
              marginTop: spacing.sm,
            }}
            maxFontSizeMultiplier={1.5}
          >
            {description}
          </Text>
        </View>
      </View>
    </GradientPanel>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  textBlock: { flex: 1 },
});
