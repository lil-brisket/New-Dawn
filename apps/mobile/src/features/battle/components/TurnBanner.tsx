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

  const displayMessage = message ?? turn.phaseLabel;

  return (
    <View
      style={[
        styles.wrap,
        { gap: spacing.xs },
        battleTheme?.platform.key === 'web' && styles.wrapWeb,
      ]}
    >
      <Text
        style={{
          color: colors.textMuted,
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.semibold,
          textAlign: 'center',
          letterSpacing: 1,
        }}
      >
        TURN
      </Text>
      <Text
        style={{
          color: colors.text,
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold,
          textAlign: 'center',
        }}
      >
        {turn.turn}
      </Text>
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
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', maxWidth: 120, minWidth: 96 },
  wrapWeb: { maxWidth: 200, flexGrow: 0, flexShrink: 0 },
  banner: {},
});
