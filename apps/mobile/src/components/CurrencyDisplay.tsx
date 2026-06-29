import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { AppIcon } from './AppIcon';

export function CurrencyDisplay() {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.row, { gap: spacing.md }]}>
      <View style={[styles.chip, { backgroundColor: colors.surface, gap: spacing.xs }]}>
        <AppIcon name="gold" size="sm" color={colors.warning} accessibilityLabel="Gold" />
        <Text style={{ color: colors.text, fontSize: typography.fontSize.sm }}>12,450</Text>
      </View>
      <View style={[styles.chip, { backgroundColor: colors.surface, gap: spacing.xs }]}>
        <AppIcon name="gem" size="sm" color={colors.accent} accessibilityLabel="Gems" />
        <Text style={{ color: colors.text, fontSize: typography.fontSize.sm }}>320</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
});
