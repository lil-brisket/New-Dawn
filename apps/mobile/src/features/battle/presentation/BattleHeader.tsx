import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import { mockBattle } from '@/mocks/battle';

export function BattleHeader() {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.row, { gap: spacing.md }]}>
      <View style={[styles.badge, { backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.accent, fontSize: typography.fontSize.sm }}>
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
      <View style={[styles.badge, { backgroundColor: colors.primaryDark }]}>
        <Text style={{ color: colors.text, fontSize: typography.fontSize.sm }}>
          {mockBattle.turn === 'player' ? 'Your Turn' : 'Enemy Turn'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
});
