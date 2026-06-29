import { View, Text } from 'react-native';
import { HealthBar, ManaBar, useTheme } from '@dawn/ui';
import { mockBattle } from '@/mocks/battle';

export function BattleBottomBar() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={{ color: colors.textSecondary, fontSize: typography.fontSize.sm }}>
        Party Status
      </Text>
      <HealthBar value={mockBattle.playerHp} max={mockBattle.playerMaxHp} />
      <ManaBar value={mockBattle.playerSp} max={mockBattle.playerMaxSp} />
    </View>
  );
}
