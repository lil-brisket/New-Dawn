import { ScrollView, Text } from 'react-native';
import { Panel, useTheme } from '@dawn/ui';
import { mockBattle } from '@/mocks/battle';

export function BattleLog() {
  const { colors, spacing, typography } = useTheme();

  return (
    <Panel variant="outlined" style={{ maxHeight: 120 }}>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: typography.fontSize.sm,
          marginBottom: spacing.xs,
        }}
      >
        Battle Log
      </Text>
      <ScrollView>
        {mockBattle.log.map((entry, index) => (
          <Text
            key={`${index}-${entry}`}
            style={{
              color: colors.textMuted,
              fontSize: typography.fontSize.xs,
              marginBottom: spacing.xs,
            }}
          >
            {entry}
          </Text>
        ))}
      </ScrollView>
    </Panel>
  );
}
