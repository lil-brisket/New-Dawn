import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { chipTokens } from '@dawn/ui/theme/components/chip';
import { mockBattle } from '@/mocks/battle';

export function BattleHeader() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const badgeStyle = {
    paddingHorizontal: chipTokens.paddingHorizontal,
    paddingVertical: chipTokens.paddingVertical,
    borderRadius: chipTokens.borderRadius,
  };

  return (
    <View style={[styles.row, { gap: spacing.md }]}>
      <View style={[styles.badge, badgeStyle, { backgroundColor: colors.surface }]}>
        <Text
          style={{
            color: colors.gold,
            fontSize: chipTokens.fontSize,
            fontWeight: chipTokens.fontWeight,
          }}
        >
          Round {mockBattle.round}
        </Text>
      </View>
      <Text
        style={{
          color: colors.text,
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold,
          flex: 1,
        }}
      >
        vs {mockBattle.enemyName}
      </Text>
      <View style={[styles.badge, badgeStyle, { backgroundColor: colors.primaryDark }]}>
        <Text
          style={{
            color: colors.text,
            fontSize: chipTokens.fontSize,
            fontWeight: chipTokens.fontWeight,
          }}
        >
          {mockBattle.turn === 'player' ? 'Your Turn' : 'Enemy Turn'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  badge: {},
});
