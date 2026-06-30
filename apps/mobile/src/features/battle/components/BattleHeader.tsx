import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@dawn/ui';
import type { BattleTheme } from '../theme/BattleTheme';
import type { TeamDisplay, TurnDisplay } from '../utils/battleDisplay';
import { CombatantPanel } from './CombatantPanel';
import { TurnBanner } from './TurnBanner';

export interface BattleHeaderProps {
  teamA: TeamDisplay;
  teamB: TeamDisplay;
  turn: TurnDisplay;
  turnBannerMessage?: string | null;
  battleTheme: BattleTheme;
  onEndBattle?: () => void;
}

export function BattleHeader({
  teamA,
  teamB,
  turn,
  turnBannerMessage,
  battleTheme,
  onEndBattle,
}: BattleHeaderProps) {
  const { theme } = useTheme();
  const { spacing, colors, typography } = theme;

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: battleTheme.headerPaddingHorizontal,
          gap: spacing.xs,
        },
        battleTheme.platform.key === 'web' && {
          paddingTop: spacing.sm,
          paddingBottom: spacing.xs,
        },
      ]}
    >
      <View
        style={[
          styles.row,
          { gap: spacing.sm },
          battleTheme.platform.key === 'web' && styles.rowWeb,
        ]}
      >
        <CombatantPanel team={teamA} alignment="left" battleTheme={battleTheme} />
        <TurnBanner turn={turn} message={turnBannerMessage} battleTheme={battleTheme} />
        <CombatantPanel team={teamB} alignment="right" battleTheme={battleTheme} />
      </View>
      {onEndBattle ? (
        <Pressable onPress={onEndBattle} style={styles.endBattle}>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              textAlign: 'center',
            }}
          >
            End Battle
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  rowWeb: { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  endBattle: { alignSelf: 'center', paddingVertical: 2 },
});
