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
  const { spacing, colors, typography, radius, border } = theme;
  const isWeb = battleTheme.platform.key === 'web';
  const compact = battleTheme.platform.compactHeader;

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: battleTheme.headerPaddingHorizontal,
          gap: compact ? spacing[2] : spacing.xs,
        },
        isWeb && {
          paddingTop: spacing.sm,
          paddingBottom: spacing.xs,
        },
      ]}
    >
      <View
        style={[styles.row, { gap: compact ? spacing.xs : spacing.sm }, isWeb && styles.rowWeb]}
      >
        <CombatantPanel
          team={teamA}
          alignment="left"
          battleTheme={battleTheme}
          isActiveTurn={turn.activeTeam === 'player'}
        />
        <TurnBanner turn={turn} message={turnBannerMessage} battleTheme={battleTheme} />
        <CombatantPanel
          team={teamB}
          alignment="right"
          battleTheme={battleTheme}
          isActiveTurn={turn.activeTeam === 'enemy'}
        />
      </View>
      {onEndBattle ? (
        <Pressable
          onPress={onEndBattle}
          style={[
            styles.endBattleBtn,
            compact && {
              borderColor: colors.border,
              borderWidth: border.thin,
              borderRadius: radius.sm,
              paddingVertical: spacing[2],
              paddingHorizontal: spacing.sm,
            },
          ]}
          hitSlop={6}
        >
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
  endBattleBtn: { alignSelf: 'center' },
});
