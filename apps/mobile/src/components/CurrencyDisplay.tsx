import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { chipTokens } from '@dawn/ui/theme/components/chip';
import { AppIcon } from './AppIcon';

export function CurrencyDisplay() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <View style={[styles.row, { gap: spacing.md }]}>
      <View
        style={[
          styles.chip,
          {
            backgroundColor: colors.surface,
            gap: spacing.xs,
            paddingHorizontal: chipTokens.paddingHorizontal,
            paddingVertical: chipTokens.paddingVertical,
            borderRadius: chipTokens.borderRadius,
          },
        ]}
      >
        <AppIcon name="gold" size="sm" color={colors.gold} accessibilityLabel="Gold" />
        <Text
          style={{
            color: colors.text,
            fontSize: chipTokens.fontSize,
            fontWeight: chipTokens.fontWeight,
          }}
        >
          12,450
        </Text>
      </View>
      <View
        style={[
          styles.chip,
          {
            backgroundColor: colors.surface,
            gap: spacing.xs,
            paddingHorizontal: chipTokens.paddingHorizontal,
            paddingVertical: chipTokens.paddingVertical,
            borderRadius: chipTokens.borderRadius,
          },
        ]}
      >
        <AppIcon name="gem" size="sm" color={colors.gold} accessibilityLabel="Gems" />
        <Text
          style={{
            color: colors.text,
            fontSize: chipTokens.fontSize,
            fontWeight: chipTokens.fontWeight,
          }}
        >
          320
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
