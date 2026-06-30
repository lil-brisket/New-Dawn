import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { useTheme } from '@dawn/ui';
import type { TurnDisplay } from '../utils/battleDisplay';
import type { BattleTheme } from '../theme/BattleTheme';

export interface TurnBannerProps {
  turn: TurnDisplay;
  message?: string | null;
  battleTheme?: BattleTheme;
}

export function TurnBanner({ turn, message, battleTheme }: TurnBannerProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography, radius } = theme;
  const compact = battleTheme?.platform.compactHeader ?? false;
  const isWeb = battleTheme?.platform.key === 'web';

  const displayMessage = message ?? turn.phaseLabel;
  const showPlayerArrow = turn.activeTeam === 'player';
  const showEnemyArrow = turn.activeTeam === 'enemy';
  const arrowSize = compact ? typography.fontSize.md : typography.fontSize.lg;

  return (
    <View
      style={[
        styles.wrap,
        { gap: compact ? 2 : spacing.xs },
        isWeb && styles.wrapWeb,
        compact && styles.wrapCompact,
      ]}
    >
      <View style={[styles.arrowRow, { paddingHorizontal: spacing.xs }]}>
        <Text
          style={[
            styles.arrow,
            {
              color: colors.warning,
              fontSize: arrowSize,
              opacity: showPlayerArrow ? 1 : 0,
            },
          ]}
        >
          ◀
        </Text>
        <View style={styles.arrowSpacer} />
        <Text
          style={[
            styles.arrow,
            {
              color: colors.warning,
              fontSize: arrowSize,
              opacity: showEnemyArrow ? 1 : 0,
            },
          ]}
        >
          ▶
        </Text>
      </View>
      <Text
        style={{
          color: colors.textMuted,
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.semibold,
          textAlign: 'center',
          letterSpacing: compact ? 0.5 : 1,
        }}
      >
        {compact ? `ROUND ${turn.round}` : 'ROUND'}
      </Text>
      {!compact ? (
        <Text
          style={{
            color: colors.text,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            textAlign: 'center',
          }}
        >
          {turn.round}
        </Text>
      ) : null}
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: typography.fontSize.xs,
          textAlign: 'center',
        }}
        numberOfLines={1}
      >
        {turn.areaName}
      </Text>
      {displayMessage ? (
        compact ? (
          <Text
            style={{
              color: colors.primary,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.bold,
              textAlign: 'center',
            }}
            numberOfLines={1}
          >
            {displayMessage}
          </Text>
        ) : (
          <Animated.View
            entering={FadeInDown.duration(theme.animation.duration.normal)}
            exiting={FadeOut.duration(theme.animation.duration.fast)}
            style={[
              styles.banner,
              {
                backgroundColor: colors.primaryDark,
                borderRadius: radius.md,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                marginTop: spacing.xs,
              },
            ]}
          >
            <Text
              style={{
                color: colors.textInverse,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
                textAlign: 'center',
              }}
            >
              {displayMessage}
            </Text>
          </Animated.View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', maxWidth: 120, minWidth: 72 },
  wrapWeb: { maxWidth: 200, flexGrow: 0, flexShrink: 0 },
  wrapCompact: { maxWidth: 104, minWidth: 80, flexShrink: 1 },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 16,
  },
  arrow: { fontWeight: 'bold', width: 18, textAlign: 'center' },
  arrowSpacer: { flex: 1 },
  banner: {},
});
